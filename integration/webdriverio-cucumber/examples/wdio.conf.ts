import { StdOutReporter } from '@integration/testing-tools';
import { Duration } from '@serenity-js/core';

export const config = {

    framework: '@serenity-js/webdriverio',
    // framework: 'cucumber',

    serenity: {
        runner: 'cucumber',
        // crew: [
        //     new StdOutReporter(),
        // ],
        cueTimeout: Duration.ofSeconds(1),
    },

    cucumberOpts: {
        require: [
            './examples/features/step_definitions/*.js',
        ],
    },

    specs: [
        // './features/passing.feature'
    ],

    reporters: [
        'spec',
    ],

    runner: 'local',

    maxInstances: 1,

    headless: true,

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

    logLevel: 'debug',

    waitforTimeout: 10000,

    connectionRetryTimeout: 90000,

    connectionRetryCount: 3,
};
