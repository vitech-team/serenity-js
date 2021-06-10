/* eslint-disable unicorn/filename-case */
import { SerenityConfig } from '@serenity-js/core';
import type { Options } from '@wdio/types';

export interface WebdriverIOConfig extends Options.Testrunner {
    serenity?: SerenityConfig & { runner?: string };
}
