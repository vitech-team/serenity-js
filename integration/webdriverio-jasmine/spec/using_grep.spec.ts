import 'mocha';

import { expect, ifExitCodeIsOtherThan, logOutput, PickEvent, StdOutReporter } from '@integration/testing-tools';
import { SceneFinished, SceneStarts, SceneTagged, TestRunnerDetected } from '@serenity-js/core/lib/events';
import { ExecutionSkipped, FeatureTag, Name } from '@serenity-js/core/lib/model';
import { wdio } from '../src';

describe('@serenity-js/mocha', function () {

    this.timeout(30000);

    it('allows for selective execution of scenarios via grep', () =>
        wdio(
            './examples/wdio.conf.ts',
            '--spec=examples/failing.spec.js',
            '--jasmineOpts.grep=".*passes.*"',
        )
        .then(ifExitCodeIsOtherThan(0, logOutput))
        .then(res => {

            expect(res.exitCode).to.equal(0);

            PickEvent.from(StdOutReporter.parse(res.stdout))
                .next(SceneStarts,         event => expect(event.details.name).to.equal(new Name('A scenario fails')))
                .next(SceneTagged,         event => expect(event.tag).to.equal(new FeatureTag('Jasmine')))
                .next(TestRunnerDetected,  event => expect(event.name).to.equal(new Name('Jasmine')))
                .next(SceneFinished,       event => expect(event.outcome).to.equal(new ExecutionSkipped()))
            ;
        }));
});
