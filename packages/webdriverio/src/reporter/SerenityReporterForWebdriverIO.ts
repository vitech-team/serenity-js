// import { Serenity, SerenityConfig } from '@serenity-js/core';
// import WDIOReporter, { AfterCommandArgs, BeforeCommandArgs, HookStats, RunnerStats, SuiteStats, TestStats } from '@wdio/reporter';
// import { TestRunStarts } from '@serenity-js/core/lib/events';
//
// export class SerenityReporterForWebdriverIO extends WDIOReporter {
//     constructor(
//         private readonly serenity: Serenity,
//         options: SerenityConfig
//     ) {
//         super({ ...options, stdout: true });
//         this.write(`>> SerenityJS::constructor ` + JSON.stringify(Object.keys(options)) + '\n');
//         this.serenity.configure(options);
//     }
//
//     // todo: for cucumber, test with both scenario-level report on and off:
//     //  asd https://github.com/webdriverio/webdriverio/blob/main/packages/wdio-cucumber-framework/src/reporter.ts#L28
//
//     // todo: emit cucumber tags
//
//     get isSynchronised(): boolean {
//         return true;
//     }
//
//     onRunnerStart(runnerStats: RunnerStats): void {
//         // {
//         //     'type': 'runner',
//         //     'start': '2021-03-29T22:33:32.731Z',
//         //     '_duration': 0,
//         //     'cid': '0-0',
//         //     'capabilities': {
//         //         'acceptInsecureCerts': false,
//         //         'browserName': 'chrome',
//         //         'browserVersion': '89.0.4389.90',
//         //         'chrome': {
//         //             'chromedriverVersion': '89.0.4389.23 (61b08ee2c50024bab004e48d2b1b083cdbdac579-refs/branch-heads/4389@{#294})',
//         //             'userDataDir': '/var/folders/st/0yvd0lq965d34hkqp98ns1640000gn/T/.com.google.Chrome.6BZgJu',
//         //         },
//         //         'goog:chromeOptions': { 'debuggerAddress': 'localhost:64131' },
//         //         'networkConnectionEnabled': false,
//         //         'pageLoadStrategy': 'normal',
//         //         'platformName': 'mac os x',
//         //         'proxy': {},
//         //         'setWindowRect': true,
//         //         'strictFileInteractability': false,
//         //         'timeouts': { 'implicit': 0, 'pageLoad': 300000, 'script': 30000 },
//         //         'unhandledPromptBehavior': 'dismiss and notify',
//         //         'webauthn:extension:largeBlob': true,
//         //         'webauthn:virtualAuthenticators': true,
//         //         'sessionId': 'd926bf14973eef4ec5b0c00e942f0a0a',
//         //     },
//         //     'sanitizedCapabilities': 'chrome.89_0_4389_90.macosx',
//         //     'config': {
//         //         'protocol': 'http',
//         //         'hostname': 'localhost',
//         //         'port': 9515,
//         //         'path': '/',
//         //         'capabilities': {
//         //             'browserName': 'chrome',    // todo tag browser
//         //             'goog:chromeOptions': { 'args': ['--disable-infobars', '--no-sandbox', '--disable-gpu', '--window-size=1024x768']
//         //         } },
//         //         'logLevel': 'debug',
//         //         'connectionRetryTimeout': 90000,
//         //         'connectionRetryCount': 3,
//         //         'logLevels': {},
//         //         'strictSSL': true,
//         //         'requestedCapabilities': { 'browserName': 'chrome', 'goog:chromeOptions': { 'args': ['--disable-infobars', '--no-sandbox', '--disable-gpu', '--window-size=1024x768'] } },
//         //         'specs': ['/Users/jan/Projects/serenity-js/serenity-js/integration/webdriverio/examples/mocha/*.spec.ts'],
//         //         'exclude': [],
//         //         'suites': {},
//         //         'bail': 0,
//         //         'waitforInterval': 500,
//         //         'waitforTimeout': 10000,
//         //         'framework': 'mocha',           // todo tag framework
//         //         'reporters': ['spec', [null, {
//         //             'actors': {}, 'crew': [], 'cueTimeout': 1000,
//         //         }]],
//         //         'services': ['chromedriver'],
//         //         'execArgv': [],
//         //         'maxInstances': 1,
//         //         'maxInstancesPerCapability': 100,
//         //         'filesToWatch': [],
//         //         'onPrepare': [],
//         //         'onWorkerStart': [],
//         //         'before': [],
//         //         'beforeSession': [],
//         //         'beforeSuite': [],
//         //         'beforeHook': [],
//         //         'beforeTest': [],
//         //         'beforeCommand': [],
//         //         'afterCommand': [],
//         //         'afterTest': [],
//         //         'afterHook': [],
//         //         'afterSuite': [],
//         //         'afterSession': [],
//         //         'after': [],
//         //         'onComplete': [],
//         //         'onReload': [],
//         //         'automationProtocol': 'webdriver',
//         //     },
//         //     'specs': ['/Users/jan/Projects/serenity-js/serenity-js/integration/webdriverio/examples/mocha/passing_scenario.spec.ts'],
//         //     'sessionId': 'd926bf14973eef4ec5b0c00e942f0a0a',
//         //     'isMultiremote': false,
//         //     'retry': 0,
//         // };
//
//         // this.write(`>> onRunnerStart ` + JSON.stringify(runnerStats) + '\n');
//
//         this.serenity.announce(new TestRunStarts(this.serenity.currentTime()));
//     }
//
//     onBeforeCommand(commandArgs: BeforeCommandArgs): void {
//         this.write(`>> onBeforeCommand ` + JSON.stringify(commandArgs) + '\n');
//     }
//
//     onAfterCommand(commandArgs: AfterCommandArgs): void {
//         this.write(`>> onAfterCommand ` + JSON.stringify(commandArgs) + '\n');
//     }
//
//     onSuiteStart(suiteStats: SuiteStats): void {
//         this.write(`>> onSuiteStart ` + JSON.stringify(suiteStats) + '\n');
//     }
//
//     onHookStart(hookStat: HookStats): void {
//         this.write(`>> onHookStart ` + JSON.stringify(hookStat) + '\n');
//     }
//
//     onHookEnd(hookStats: HookStats): void {
//         this.write(`>> onHookEnd ` + JSON.stringify(hookStats) + '\n');
//     }
//
//     onTestStart(testStats: TestStats): void {
//         this.write(`>> onTestStart ` + JSON.stringify(testStats) + '\n');
//     }
//
//     onTestPass(testStats: TestStats): void {
//         this.write(`>> onTestPass ` + JSON.stringify(testStats) + '\n');
//     }
//
//     onTestFail(testStats: TestStats): void {
//         this.write(`>> onTestFail ` + JSON.stringify(testStats) + '\n');
//     }
//
//     onTestRetry(testStats: TestStats): void {
//         this.write(`>> onTestRetry ` + JSON.stringify(testStats) + '\n');
//     }
//
//     onTestSkip(testStats: TestStats): void {
//         this.write(`>> onTestSkip ` + JSON.stringify(testStats) + '\n');
//     }
//
//     onTestEnd(testStats: TestStats): void {
//         this.write(`>> onTestEnd ` + JSON.stringify(testStats) + '\n');
//     }
//
//     onSuiteEnd(suiteStats: SuiteStats): void {
//         this.write(`>> onSuiteEnd ` + JSON.stringify(suiteStats) + '\n');
//     }
//
//     onRunnerEnd(runnerStats: RunnerStats): void {
//         this.write(`>> onRunnerEnd ` + JSON.stringify(runnerStats) + '\n');
//     }
// }
