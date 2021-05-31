import 'mocha';
import { Attribute, by, Target, Text } from '../../../src';
import { CreatePage, VisitPage } from '../../pages';
import { actorCalled, LogicError, replace, toNumber, trim } from '@serenity-js/core';
import { Ensure, equals } from '@serenity-js/assertions';
import { expect } from '@integration/testing-tools';
import { LocalServer, StartLocalServer, StopLocalServer } from '@serenity-js/local-server';
import { ChangeApiConfig } from '@serenity-js/rest';

describe('Attribute', () => {

    before(() =>
        actorCalled('Wendy').attemptsTo(
            StartLocalServer.onRandomPort(),
            ChangeApiConfig.setUrlTo(LocalServer.url()),
        ));

    after(() =>
        actorCalled('Wendy').attemptsTo(
            StopLocalServer.ifRunning(),
        ));

    describe('called', () => {

        const DOM = Target.the('DOM').located(by.tagName('html'));

        /** @test {Attribute.called} */
        it('allows the actor to read an attribute of a DOM element matching the locator', () =>
            actorCalled('Wendy').attemptsTo(
                CreatePage('example', `<html lang="en" />`),

                VisitPage('example'),

                Ensure.that(Attribute.called('lang').of(DOM), equals('en')),
            ));

        /** @test {Attribute.called} */
        /** @test {Attribute#toString} */
        it('produces a sensible description of the question being asked', () => {
            expect(Attribute.called('lang').of(DOM).toString())
                .to.equal('"lang" attribute of the DOM');
        });

        /** @test {Attribute.called} */
        it('complains if the target is not specified', () =>
            expect(actorCalled('Wendy').attemptsTo(
                CreatePage('example', `<html lang="en" />`),

                VisitPage('example'),

                Ensure.that(Attribute.called('lang'), equals('en')),
            )).to.be.rejectedWith(LogicError, `Target not specified`));
    });
});
