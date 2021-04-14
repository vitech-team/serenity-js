import { resolve } from 'path';
import { createWriteStream } from 'fs';
import { StreamReporter } from '@serenity-js/core';
import Inspector from './src/Inspector';

export const config = {

    framework: '@serenity-js/webdriverio',
    // framework: 'mocha',

    serenity: {
        crew: [
            new StreamReporter(createWriteStream(`events-${ process.pid }.ndjson`)),
        ]
    },

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },

    specs: [
        './spec/**/*.spec.ts',
    ],

    reporters: [
        'spec',
        Inspector,
    ],

    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            transpileOnly: true,
            project: resolve(__dirname, './tsconfig.json'),
        },
    },

    headless: true,
    automationProtocol: 'devtools',

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
