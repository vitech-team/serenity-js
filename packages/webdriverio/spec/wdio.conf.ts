import { isCI } from 'ci-info';
import { resolve } from 'path';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { Actors } from './screenplay/Actors';

export const config = {

    framework: resolve(__dirname, '../src'),

    serenity: {
        actors: new Actors(),
        crew: isCI ? [] : [
            ConsoleReporter.forDarkTerminals(),
        ]
    },

    mochaOpts: {
        ui: 'bdd',
        timeout: 60_000_000,
    },

    specs: [
        './spec/**/*.spec.ts',
    ],

    reporters: [
        // 'spec',
        'dot',
    ],

    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            transpileOnly: true,
            project: resolve(__dirname, '../tsconfig.json'),
        },
    },

    headless: true,
    automationProtocol: 'devtools',

    runner: 'local',

    capabilities: [{

        browserName: 'chrome',
        'goog:chromeOptions': {
            args: [
                '--headless',
                '--disable-infobars',
                '--no-sandbox',
                '--disable-gpu',
                '--window-size=1024x768',
            ],
        }
    }],

    logLevel: 'warn',

    waitforTimeout: 10000,

    connectionRetryTimeout: 90000,

    connectionRetryCount: 3,

    maxInstances: isCI ? 1 : undefined,
};
