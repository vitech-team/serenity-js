import { ArtifactArchiver, Serenity } from '@serenity-js/core';
import { ModuleLoader, TestRunnerAdapter } from '@serenity-js/core/lib/io';
import type { Capabilities } from '@wdio/types';
import type { EventEmitter } from 'events';
import { isPlainObject } from 'is-plain-object';
import { WebdriverIONotifier } from './WebdriverIONotifier';
import { WebdriverIOConfig } from './WebdriverIOConfig';

import deepmerge = require('deepmerge');

export class WebdriverIOFrameworkAdapter {

    private readonly config: WebdriverIOConfig;

    private adapter: TestRunnerAdapter;
    private notifier: WebdriverIONotifier;

    constructor(
        private readonly serenity: Serenity,
        private readonly loader: ModuleLoader,
        private readonly cid: string,
        config: WebdriverIOConfig,
        private readonly specs: string[],
        private readonly capabilities: Capabilities.RemoteCapability,
        private readonly reporter: EventEmitter
    ) {
        this.config = deepmerge<WebdriverIOConfig>(this.defaultConfig(), config, {
            isMergeableObject: isPlainObject,
        });

        // todo: load appropriate adapter based on config
        // todo: throw if anything other than Mocha
        const { MochaAdapter } = this.loader.require('@serenity-js/mocha/lib/adapter')

        this.adapter = new MochaAdapter(this.config.mochaOpts, this.loader);

        this.notifier = new WebdriverIONotifier(
            this.reporter,
            this.adapter.successThreshold(),
            this.cid,
            this.specs,
        );

        this.serenity.configure({
            cueTimeout: this.config.serenity.cueTimeout,
            actors:     this.config.serenity.actors,
            crew: [
                ...this.config.serenity.crew,
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
