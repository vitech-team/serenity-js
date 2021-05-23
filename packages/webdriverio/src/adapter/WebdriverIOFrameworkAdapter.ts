import { ConfigurationError, Serenity } from '@serenity-js/core';
import { Config, FileFinder, FileSystem, ModuleLoader, Path, TestRunnerAdapter } from '@serenity-js/core/lib/io';
import type { Capabilities } from '@wdio/types';
import type { EventEmitter } from 'events';
import { isPlainObject } from 'is-plain-object';
import { WebdriverIONotifier } from './WebdriverIONotifier';

import { WebdriverIOConfig } from './WebdriverIOConfig';
import { ProvidesWriteStream } from './ProvidesWriteStream';
import deepmerge = require('deepmerge');
import { BufferedOutputStream } from './BufferedOutputStream';
import { BrowserCapabilitiesReporter } from './reporter';
import { InitialisesReporters } from './InitialisesReporters';

export class WebdriverIOFrameworkAdapter {

    private readonly fileSystem: FileSystem;
    private readonly finder: FileFinder;

    private adapter: TestRunnerAdapter;
    private notifier: WebdriverIONotifier;

    constructor(
        private readonly serenity: Serenity,
        private readonly loader: ModuleLoader,
        private readonly cwd: Path,
        private readonly cid: string,
        webdriverIOConfig: WebdriverIOConfig,
        private readonly specs: string[],
        private readonly capabilities: Capabilities.RemoteCapability,
        reporter: EventEmitter & ProvidesWriteStream & InitialisesReporters
    ) {
        this.fileSystem = new FileSystem(cwd);
        this.finder     = new FileFinder(cwd);

        const config = deepmerge<WebdriverIOConfig>(this.defaultConfig(), webdriverIOConfig, {
            isMergeableObject: isPlainObject,
        });

        this.adapter = this.testRunnerAdapterFrom(config);

        // fixme: this is the only (hacky) way to register a fake reporter programmatically (as of @wdio/reporter 7.4.2)
        //  - https://github.com/webdriverio/webdriverio/blob/365fb0ad79fcf4471f21f23e18afa6818986dbdb/packages/wdio-runner/src/index.ts#L147-L181
        //  - https://github.com/webdriverio/webdriverio/blob/365fb0ad79fcf4471f21f23e18afa6818986dbdb/packages/wdio-runner/src/reporter.ts#L24
        (reporter as any)._reporters.push(reporter.initReporter([
            BrowserCapabilitiesReporter, { serenity: this.serenity },
        ]));

        this.notifier = new WebdriverIONotifier(
            reporter,
            this.adapter.successThreshold(),
            cid,
            this.specs,
        );

        const outputStream = new BufferedOutputStream(
            `[${this.cid}]`,
            reporter.getWriteStreamObject('@serenity-js/webdriverio')
        );

        this.serenity.configure({
            outputStream,
            cueTimeout:     config.serenity.cueTimeout,
            actors:         config.serenity.actors,
            crew: [
                ...config.serenity.crew,
                this.notifier,
            ]
        });
    }

    async init(): Promise<WebdriverIOFrameworkAdapter> {

        await this.adapter.load(this.specs);

        return this;
    }

    hasTests(): boolean {
        return this.adapter.scenarioCount() > 0;
    }

    run(): Promise<number> {
        return this.adapter.run().then(() =>
            this.notifier.failureCount()
        );
    }

    private testRunnerAdapterFrom(config: WebdriverIOConfig): TestRunnerAdapter {
        // todo: clean up
        switch (config?.serenity?.runner) {
            case 'cucumber': {
                const { CucumberCLIAdapter, CucumberFormat, StandardOutput, TempFileOutput } = this.loader.require('@serenity-js/cucumber/lib/cli');

                // todo: support setting a timeout?
                delete config?.cucumberOpts?.timeout;

                const cucumberOpts = new Config(config?.cucumberOpts)
                    .where('require', requires =>
                        this.finder.filesMatching(requires).map(p => p.value)
                    )
                    .where('format', values =>
                        [].concat(values).map(value => {
                            const format = new CucumberFormat(value);

                            if (format.output === '') {
                                return format.value;
                            }

                            const basename = Path.from(format.output).basename();
                            const filenameParts = basename.split('.');

                            if (filenameParts[0] === basename) {
                                return `${ format.formatter }:${ format.output }.${ this.cid }`;
                            }

                            filenameParts.splice(-1, 0, `${ this.cid }`);

                            return `${ format.formatter }:${ format.output.replace(basename, filenameParts.join('.')) }`;
                        })
                    );

                const useSerenityReportingServices = config?.serenity?.crew?.length > 0;

                // todo: this will fail because of the defaults
                const output = useSerenityReportingServices
                    ? new StandardOutput()
                    : new TempFileOutput(this.fileSystem);

                return new CucumberCLIAdapter(cucumberOpts.object(), this.loader, output);
            }

            case 'jasmine': {
                const { JasmineAdapter } = this.loader.require('@serenity-js/jasmine/lib/adapter')
                return new JasmineAdapter(config.jasmineOpts, this.loader);
            }
            case 'mocha':
            case undefined:
                const { MochaAdapter } = this.loader.require('@serenity-js/mocha/lib/adapter')
                return new MochaAdapter(config.mochaOpts, this.loader);
            default:
                throw new ConfigurationError(`"${ config?.serenity?.runner }" is not a supported test runner. Please use "mocha", "jasmine", or "cucumber"`);
        }
    }

    private defaultConfig(): Partial<WebdriverIOConfig> {
        return {
            serenity: {
                crew: [
                    // todo: disable default crew?
                    // ArtifactArchiver.storingArtifactsAt(process.cwd(), 'target/site/serenity'),
                ]
            }
        }
    }
}
