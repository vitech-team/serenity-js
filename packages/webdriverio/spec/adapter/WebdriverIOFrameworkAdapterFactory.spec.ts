import 'mocha';

import { expect } from '@integration/testing-tools';
import { Clock, ConfigurationError, Serenity } from '@serenity-js/core';
import { ModuleLoader, TestRunnerAdapter } from '@serenity-js/core/lib/io';
import { ExecutionIgnored, Outcome } from '@serenity-js/core/lib/model';
import type { Capabilities } from '@wdio/types';
import * as sinon from 'sinon';

import { WebdriverIOFrameworkAdapterFactory } from '../../src/adapter';
import { WebdriverIOConfig } from '../../src/adapter/WebdriverIOConfig';
import EventEmitter = require('events');

describe('WebdriverIOFrameworkAdapterFactory', () => {

    const
        cid = '0-0',
        specs = [ '/users/jan/project/spec/example.spec.ts' ],
        capabilities: Capabilities.RemoteCapability = { browserName: 'chrome' };

    let serenity:   Serenity,
        loader:     sinon.SinonStubbedInstance<ModuleLoader>,
        reporter:   EventEmitter,
        factory:    WebdriverIOFrameworkAdapterFactory;

    beforeEach(() => {
        serenity    = new Serenity(new Clock());
        loader      = sinon.createStubInstance(ModuleLoader);
        reporter    = new EventEmitter();
        factory     = new WebdriverIOFrameworkAdapterFactory(
            serenity,
            loader,
        );
    });

    function defaultConfig(overrides: Partial<WebdriverIOConfig> = {}): WebdriverIOConfig {
        return {
            capabilities: [ capabilities ],
            ...overrides,
        }
    }

    describe('when initialising WebdriverIOFrameworkAdapter', () => {

        /*
         * WebdriverIO uses 'mocha' by default, so we do the same:
         * - https://github.com/webdriverio/webdriverio/blob/44b5318a8893c032d7d4989079109782a2ce9a79/packages/wdio-config/src/constants.ts#L18
         */
        it('loads specs using @serenity-js/mocha adapter by default', async () => {

            const config = defaultConfig();

            loader.require.withArgs('@serenity-js/mocha/lib/adapter').returns({ MochaAdapter: FakeTestRunnerAdapter })

            await factory.init(cid, config, specs, capabilities, reporter);

            expect(FakeTestRunnerAdapter.loadedPathsToScenarios).to.deep.equal(specs);
        });

        it('loads specs using @serenity-js/jasmine when configured to do so', async () => {

            const config = defaultConfig({
                serenity: {
                    runner: 'jasmine',
                }
            });

            loader.require.withArgs('@serenity-js/jasmine/lib/adapter').returns({ JasmineAdapter: FakeTestRunnerAdapter })

            await factory.init(cid, config, specs, capabilities, reporter);

            expect(FakeTestRunnerAdapter.loadedPathsToScenarios).to.deep.equal(specs);
        });

        it('loads specs using @serenity-js/cucumber when configured to do so');

        it('complains when configured with an invalid runner', () => {
            const config = defaultConfig({
                serenity: {
                    runner: 'invalid',
                }
            });

            expect(() => factory.init(cid, config, specs, capabilities, reporter))
                .to.throw(ConfigurationError, '"invalid" is not a supported test runner. Please use "mocha", "jasmine", or "cucumber"');
        });
    });

    class FakeTestRunnerAdapter implements TestRunnerAdapter {

        public static loadedPathsToScenarios: string[];

        async load(pathsToScenarios: string[]): Promise<void> {
            FakeTestRunnerAdapter.loadedPathsToScenarios = pathsToScenarios;
        }

        scenarioCount(): number {
            return 1;
        };

        async run(): Promise<void> {
            // no-op
        }

        successThreshold(): Outcome | { Code: number } {
            return ExecutionIgnored;
        }
    }
});
