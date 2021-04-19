import { Serenity } from '@serenity-js/core';
import { ModuleLoader } from '@serenity-js/core/lib/io';
import type { Capabilities } from '@wdio/types';
import type { EventEmitter } from 'events';
import { WebdriverIOFrameworkAdapter } from './WebdriverIOFrameworkAdapter';
import { WebdriverIOConfig } from './WebdriverIOConfig';

export class WebdriverIOFrameworkAdapterFactory {
    constructor(
        private readonly serenity: Serenity,
        private readonly loader: ModuleLoader,
    ) {
    }

    public init(
            cid: string,
            config: WebdriverIOConfig,
            specs: string[],
            capabilities: Capabilities.RemoteCapability,
            reporter: EventEmitter
    ): Promise<WebdriverIOFrameworkAdapter> {
        return new WebdriverIOFrameworkAdapter(
            this.serenity,
            this.loader,
            cid,
            config,
            specs,
            capabilities,
            reporter,
        ).init()
    }
}
