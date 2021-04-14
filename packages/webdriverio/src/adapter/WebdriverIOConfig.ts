import type { Options } from '@wdio/types';
import { SerenityConfig } from '@serenity-js/core';

export interface WebdriverIOConfig extends Options.Testrunner {
    serenity: SerenityConfig & { runner?: string };
}
