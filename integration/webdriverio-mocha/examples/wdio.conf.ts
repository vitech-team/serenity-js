import { Duration } from '@serenity-js/core';
import { resolve } from 'path';
import { Actors } from './src';
import { StdOutReporter } from '../src';

export const config = {

    framework: '@serenity-js/webdriverio',

    serenity: {
        runner: 'mocha',
        actors: new Actors(),
        crew: [
            new StdOutReporter(),
        ],
        cueTimeout: Duration.ofSeconds(1),
    },

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },

    specs: [ ], // specified in tests themselves to avoid loading more than needed

    reporters: [
        'spec',
    ],

    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            transpileOnly: true,
            project: resolve(__dirname, './tsconfig.json'),
        },
    },

    services: [
        'chromedriver',
    ],

    runner: 'local',

    maxInstances: 1,

    capabilities: [{

        browserName: 'chrome',
        'goog:chromeOptions': {
            args: [
                '--disable-infobars',
                '--no-sandbox',
                '--disable-gpu',
                '--window-size=1024x768',
            ],
        }
    }],

    logLevel: 'debug',

    waitforTimeout: 10000,

    connectionRetryTimeout: 90000,

    connectionRetryCount: 3,
};
