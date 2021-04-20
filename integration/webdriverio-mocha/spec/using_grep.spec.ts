import 'mocha';

import { expect, ifExitCodeIsOtherThan, logOutput, PickEvent } from '@integration/testing-tools';
import { TestRunFinished, TestRunFinishes, TestRunStarts } from '@serenity-js/core/lib/events';
import { StdOutReporter, wdio } from '../src';

describe('@serenity-js/mocha', function () {

    this.timeout(30000);

    it('allows for selective execution of scenarios via grep', () =>
        wdio(
            './examples/wdio.conf.ts',
            '--spec=examples/failing_scenario.spec.ts',
            '--mochaOpts.grep=".*passes.*"',
        )
        .then(ifExitCodeIsOtherThan(0, logOutput))
        .then(res => {

            expect(res.exitCode).to.equal(0);

            // WebdriverIO won't even touch the scenarios that have been excluded using grep
            // so they won't emit any events
            const events = StdOutReporter.parse(res.stdout);
            expect(events).to.have.lengthOf(0);
        }));
});
