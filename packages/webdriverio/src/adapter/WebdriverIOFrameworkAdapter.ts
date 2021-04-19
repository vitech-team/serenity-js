import { ArtifactArchiver, Serenity } from '@serenity-js/core';
import { ModuleLoader, TestRunnerAdapter } from '@serenity-js/core/lib/io';
import type { Capabilities } from '@wdio/types';
import type { EventEmitter } from 'events';
import { isPlainObject } from 'is-plain-object';
import { WebdriverIONotifier } from './WebdriverIONotifier';
import { WebdriverIOConfig } from './WebdriverIOConfig';

import deepmerge = require('deepmerge');

export class WebdriverIOFrameworkAdapter {

    private adapter: TestRunnerAdapter;
    private notifier: WebdriverIONotifier;

    constructor(
        private readonly serenity: Serenity,
        private readonly loader: ModuleLoader,
        cid: string,
        webdriverIOConfig: WebdriverIOConfig,
        private readonly specs: string[],
        private readonly capabilities: Capabilities.RemoteCapability,
        reporter: EventEmitter
    ) {
        const config = deepmerge<WebdriverIOConfig>(this.defaultConfig(), webdriverIOConfig, {
            isMergeableObject: isPlainObject,
        });

        this.adapter = this.testRunnerAdapterFrom(config)

        this.notifier = new WebdriverIONotifier(
            reporter,
            this.adapter.successThreshold(),
            cid,
            this.specs,
        );

        this.serenity.configure({
            cueTimeout: config.serenity.cueTimeout,
            actors:     config.serenity.actors,
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
        switch (config?.serenity?.runner) {
            case 'jasmine':
                const { JasmineAdapter } = this.loader.require('@serenity-js/jasmine/lib/adapter')
                return new JasmineAdapter(config.jasmineOpts, this.loader);

            default:
                const { MochaAdapter } = this.loader.require('@serenity-js/mocha/lib/adapter')
                return new MochaAdapter(config.mochaOpts, this.loader);
        }
    }

    private defaultConfig(): Partial<WebdriverIOConfig> {
        return {
            serenity: {
                crew: [
                    ArtifactArchiver.storingArtifactsAt(process.cwd(), 'target/site/serenity'),
                ]
            }
        }
    }
}
