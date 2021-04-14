import 'mocha';
import EventEmitter = require('events');
import { given } from 'mocha-testdata';
import sinon = require('sinon');

import { AssertionError, Cast, Clock, Duration, ImplementationPendingError, Stage, StageManager, TestCompromisedError } from '@serenity-js/core';
import { DomainEvent, SceneFinished, SceneStarts, TestRunFinished, TestRunFinishes, TestRunStarts } from '@serenity-js/core/lib/events';
import { FileSystemLocation, Path } from '@serenity-js/core/lib/io';
import {
    Category,
    CorrelationId, ExecutionCompromised,
    ExecutionFailedWithAssertionError, ExecutionFailedWithError,
    ExecutionIgnored,
    ExecutionSkipped,
    ExecutionSuccessful, ImplementationPending,
    Name,
    Outcome,
    ScenarioDetails,
    Timestamp,
} from '@serenity-js/core/lib/model';
import { expect } from '@integration/testing-tools';

import { WebdriverIONotifier } from '../../src/adapter/WebdriverIONotifier';

describe('WebdriverIONotifier', () => {

    const
        startTime = Timestamp.fromMillisecondTimestamp(0),
        cid = '0-0',
        successThreshold: Outcome | { Code: number } = ExecutionIgnored,

        scene1Id = CorrelationId.create(),
        scene2Id = CorrelationId.create(),
        scenario1Details = new ScenarioDetails(
            new Name('Paying with a default card'),
            new Category('Online Checkout'),
            new FileSystemLocation(
                new Path(`payments/checkout.feature`),
                3,
            ),
        ),
        scenario2Details = new ScenarioDetails(
            new Name('Paying with a voucher'),
            new Category('Online Checkout'),
            new FileSystemLocation(
                new Path(`payments/checkout.feature`),
                10,
            ),
        ),
        categoryUID = 'payments/checkout.feature:Online Checkout',

        scene1Duration = Duration.ofMilliseconds(500),
        scene2Duration = Duration.ofMilliseconds(250),

        testRunStarts = new TestRunStarts(startTime),
        scene1Starts = new SceneStarts(scene1Id, scenario1Details, startTime),
        scene1FinishedWith = (outcome: Outcome) =>
            new SceneFinished(scene1Id, scenario1Details, outcome, startTime.plus(scene1Duration)),
        scene2Starts = new SceneStarts(scene2Id, scenario2Details, startTime.plus(scene1Duration)),
        scene2FinishedWith = (outcome: Outcome) =>
            new SceneFinished(scene2Id, scenario2Details, outcome, startTime.plus(scene1Duration).plus(scene2Duration)),
        testRunFinishes = new TestRunFinishes(startTime.plus(scene1Duration).plus(scene2Duration)),
        testRunFinished = new TestRunFinished(startTime.plus(scene1Duration).plus(scene2Duration)),

        executionSuccessful    = new ExecutionSuccessful(),
        executionSkipped       = new ExecutionSkipped(),
        executionIgnored       = new ExecutionIgnored(thrown(new Error('Execution ignored'))),
        implementationPending  = new ImplementationPending(thrown(new ImplementationPendingError('Step missing'))),
        failedWithAssertion    = new ExecutionFailedWithAssertionError(thrown(new AssertionError('Expected false to be true', true, false))),
        failedWithError        = new ExecutionFailedWithError(thrown(new Error(`We're sorry, something happened`))),
        compromised            = new ExecutionCompromised(thrown(new TestCompromisedError('DB is down')))
    ;

    function thrown<T extends Error>(error: T): T {
        try {
            throw error;
        } catch (e) {
            return e;
        }
    }

    function givenEvents(...events: DomainEvent[]): void {
        events.forEach(event => {
            notifier.notifyOf(event);
        })
    }

    let notifier: WebdriverIONotifier,
        reporter: sinon.SinonStubbedInstance<EventEmitter>,
        stage: Stage;

    beforeEach(() => {

        reporter = sinon.createStubInstance(EventEmitter);

        stage = new Stage(
            Cast.whereEveryoneCan(/* do nothing much */),
            new StageManager(Duration.ofMilliseconds(250), new Clock())
        );

        notifier = new WebdriverIONotifier(
            reporter,
            successThreshold,
            cid,
        );

        stage.assign(notifier);
    });

    describe('when notifying WebdriverIO', () => {

        // https://github.com/webdriverio/webdriverio/tree/main/packages/wdio-reporter

        it('translates Serenity/JS events to WebdriverIO events', () => {
            givenEvents(
                testRunStarts,
                scene1Starts,
                scene1FinishedWith(executionSuccessful),
                testRunFinished,
            );

            /*
            SuiteStats {
              type: 'suite',
              start: '2018-02-09T13:30:40.177Z',
              duration: 0,
              uid: 'root suite2',
              cid: '0-0',
              title: 'root suite',
              fullTitle: 'root suite',
              tests: [],
              hooks: [],
              suites: [] } }
             */
            expect(reporter.emit.getCall(0)).to.have.been.calledWith('suite:start', {
                type:       'suite',
                start:      scene1Starts.timestamp.toJSON(),    // ISO8601
                duration:   0,
                uid:        categoryUID,
                cid,
                title:      scene1Starts.details.category.value,
            });

            /*
            TestStats {
              type: 'test',
              start: '2018-02-09T13:30:40.180Z',
              duration: 0,
              uid: 'passing test3',
              cid: '0-0',
              title: 'passing test',
              fullTitle: 'passing test',
              retries: 0,
              state: 'pending' } }
             */

            expect(reporter.emit.getCall(1)).to.have.been.calledWith('test:start', {
                type:       'test',
                start:      scene1Starts.timestamp.toJSON(),    // ISO8601
                duration:   0,
                uid:        scene1Starts.sceneId.value,
                cid,
                title:      scene1Starts.details.name.value,
            });


            /*
            TestStats {
              type: 'test',
              start: '2018-02-09T14:11:28.075Z',
              duration: 1503,
              uid: 'passing test3',
              cid: '0-0',
              title: 'passing test',
              fullTitle: 'passing test',
              retries: 0,
              state: 'passed',
              end: '2018-02-09T14:11:29.578Z' } }
             */
            expect(reporter.emit.getCall(2)).to.have.been.calledWith('test:pass', {
                type:       'test',
                start:      scene1Starts.timestamp.toJSON(),    // ISO8601
                duration:   scene1Duration.inMilliseconds(),
                uid:        scene1Starts.sceneId.value,
                cid,
                title:      scene1Starts.details.name.value,
                state:      'passed',
                end:        scene1Starts.timestamp.plus(scene1Duration).toJSON(), // ISO8601
            });

            /*
            TestStats {
              type: 'test',
              start: '2018-02-09T14:11:28.075Z',
              duration: 1503,
              uid: 'passing test3',
              cid: '0-0',
              title: 'passing test',
              fullTitle: 'passing test',
              retries: 0,
              state: 'passed',
              end: '2018-02-09T14:11:29.578Z' } }
             */
            expect(reporter.emit.getCall(3)).to.have.been.calledWith('test:end', {
                type:       'test',
                start:      scene1Starts.timestamp.toJSON(),    // ISO8601
                duration:   scene1Duration.inMilliseconds(),
                uid:        scene1Starts.sceneId.value,
                cid,
                title:      scene1Starts.details.name.value,
                state:      'passed',
                end:        scene1Starts.timestamp.plus(scene1Duration).toJSON(), // ISO8601
            });

            /*
            * todo: this emits a subset of those fields:
            *  https://github.com/webdriverio/webdriverio/blob/main/packages/wdio-cucumber-framework/src/reporter.ts#L240

            SuiteStats {
              type: 'suite',
              start: '2018-02-09T13:30:40.177Z',
              duration: 1432,
              uid: 'root suite2',
              cid: '0-0',
              title: 'root suite',
              fullTitle: 'root suite',
              tests: [ [TestStats] ],
              hooks: [ [HookStats], [HookStats] ],
              suites: [ [Object] ],
              end: '2018-02-09T13:30:41.609Z' } }
            */
            expect(reporter.emit.getCall(4)).to.have.been.calledWith('suite:end', {
                type:       'suite',
                start:      scene1Starts.timestamp.toJSON(),    // ISO8601
                duration:   scene1Duration.inMilliseconds(),
                uid:        categoryUID,
                cid,
                title:      scene1Starts.details.category.value,
                end:        scene1Starts.timestamp.plus(scene1Duration).toJSON(), // ISO8601
            });
        });
    });

    describe('when reporting the total number of failures it has observed', () => {

        it('returns 0 when no scenarios have been executed', () => {
            givenEvents(
                testRunStarts,
                testRunFinishes,
                testRunFinished,
            );

            expect(notifier.failureCount()).to.equal(0);
        });

        given([
            { outcome: executionSuccessful, description: 'ExecutionSuccessful' },
            { outcome: executionSkipped, description: 'ExecutionSkipped' },
            { outcome: executionIgnored, description: 'ExecutionIgnored' },
        ]).
        it('returns 0 when all scenarios have their outcomes are above the success threshold', ({outcome}) => {
            givenEvents(
                testRunStarts,
                scene1Starts,
                scene1FinishedWith(outcome),
                testRunFinishes,
                testRunFinished,
            );

            expect(notifier.failureCount()).to.equal(0);
        });

        given([
            { outcome: implementationPending, description: 'OmplementationPending' },
            { outcome: failedWithAssertion,   description: 'FailedWithAssertion'   },
            { outcome: failedWithError,       description: 'FailedWithError'       },
            { outcome: compromised,           description: 'Compromised'           },
        ]).
        it('considers a scenario to be unsuccessful when its outcome is below the success threshold', ({outcome}) => {
            givenEvents(
                scene1Starts,
                scene1FinishedWith(outcome),
                scene2Starts,
                scene2FinishedWith(new ExecutionSuccessful()),
            );

            expect(notifier.failureCount()).to.equal(1);
        });
    });
});
