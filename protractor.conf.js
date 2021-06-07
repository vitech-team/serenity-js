const { hostname } = require('os');
const useSauceLabs = !! (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY);

function sauceLabsChrome(version) {
    return {
        shardTestFiles: true,
        maxInstances: 3,

        name: `Chrome ${ version }`,
        browserName: 'chrome',
        version,

        // This is needed for ChromeDriver, as of ChromeDriver 75
        // it is W3C by default. Protractor doesn't support this.
        'goog:chromeOptions':{
            w3c: false,
        },

        // This is needed with Protractor, providing the capabilities at the root of the config doesn't work when
        // you provide a custom seleniumAddress
        username:   process.env.SAUCE_USERNAME,
        access_key: process.env.SAUCE_ACCESS_KEY,

        // The build name in Sauce Labs
        build: `Serenity/JS ${ process.env.GITHUB_REF || 'unknown branch' } #${ process.env.GITHUB_RUN_NUMBER } (${ hostname() })`,
    }
}

const sauceLabsConfig = {
    seleniumAddress: `https://ondemand.us-west-1.saucelabs.com/wd/hub/`,

    multiCapabilities: [
        sauceLabsChrome('latest'),
        sauceLabsChrome('beta'),
    ]
};

const localChromeConfig = {
    chromeDriver: require(`chromedriver`).path,
    directConnect: true,

    capabilities: {
        browserName: 'chrome',
        acceptInsecureCerts : true,

        loggingPrefs: {
            browser: 'INFO',
        },

        'goog:chromeOptions': {
            // As of version 75, ChromeDriver is W3C by default, which Protractor does not fully support.
            w3c: false,
            args: [
                '--disable-web-security',
                '--allow-file-access-from-files',
                '--allow-file-access',
                '--disable-infobars',
                '--headless',
                '--disable-gpu',
                '--window-size=200x100',
            ]
        },
    }
}

module.exports = {

    SELENIUM_PROMISE_MANAGER: false,

    onPrepare: function() {
        return browser.waitForAngularEnabled(false);
    },

    allScriptsTimeout: 30 * 1000,

    framework: 'mocha',

    // specs: [ ],  // set in module-specific protractor.conf.js

    mochaOpts: {
        timeout: 60_000,
        require: [
            'ts-node/register',
        ],
        reporter: 'dot',
    },

    ... useSauceLabs
        ? sauceLabsConfig
        : localChromeConfig,
};
