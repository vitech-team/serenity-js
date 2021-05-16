import { expect } from '@integration/testing-tools';
import { ModuleLoader } from '@serenity-js/core/lib/io';
import * as sinon from 'sinon';

import { JasmineAdapter } from '../../src/adapter';
import { FakeJasmineRunner } from './FakeJasmineRunner';

/** @test JasmineAdapter */
describe('JasmineAdapter', () => {

    let loader: sinon.SinonStubbedInstance<ModuleLoader>;

    beforeEach(() => {
        loader = sinon.createStubInstance(ModuleLoader);

        loader.require.withArgs('jasmine').returns(FakeJasmineRunner);
    });

    /** @test JasmineAdapter#run */
    it('defaults to running tests sequentially rather than in a random order', async () => {

        const
            config = {},
            specs  = [];

        const adapter = new JasmineAdapter(config, loader);

        await adapter.load(specs);

        const result = adapter.run();

        FakeJasmineRunner.instance.complete(true);

        expect(FakeJasmineRunner.instance.loadConfig).to.have.been.calledWithMatch({
            random: false,
        });

        return result;
    });

    /** @test JasmineAdapter#run */
    it('configures the default timeout interval if required', async () => {

        const
            defaultTimeoutInterval = 5000,
            config = {
                defaultTimeoutInterval,
            },
            specs  = [];

        expect(FakeJasmineRunner.instance.jasmine.DEFAULT_TIMEOUT_INTERVAL).to.equal(undefined);

        const adapter = new JasmineAdapter(config, loader);

        await adapter.load(specs)
        const result = adapter.run();

        FakeJasmineRunner.instance.complete(true);

        expect(FakeJasmineRunner.instance.jasmine.DEFAULT_TIMEOUT_INTERVAL).to.equal(defaultTimeoutInterval);

        return result;
    });
});
