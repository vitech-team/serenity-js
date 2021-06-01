import 'mocha';

import { expect } from '@integration/testing-tools';
import { Ensure, not } from '@serenity-js/assertions';
import { actorCalled } from '@serenity-js/core';
import { CreatePage, DeletePage, VisitPage } from '../../pages';
import { LocalServer, StartLocalServer, StopLocalServer } from '@serenity-js/local-server';
import { ChangeApiConfig } from '@serenity-js/rest';
import { by, Click, Target } from '../../../src';
import { isSelected } from '../../expectations';

/** @test {Click} */
describe('Click', () => {

    const Form = {
        Checkbox: Target.the('checkbox').located(by.id('no-spam-please')),
    };

    before(() =>
        actorCalled('Wendy').attemptsTo(
            StartLocalServer.onRandomPort(),
            ChangeApiConfig.setUrlTo(LocalServer.url()),
        ));

    beforeEach(() =>
        actorCalled('Wendy').attemptsTo(
            CreatePage('no_spam_form', `
                <html>
                    <body>
                        <form>
                            <input type="checkbox" id="no-spam-please" />
                        </form>
                    </body>
                </html>
            `)
        ));

    afterEach(() =>
        actorCalled('Wendy').attemptsTo(
            DeletePage('no_spam_form')
        ));

    after(() =>
        actorCalled('Wendy').attemptsTo(
            StopLocalServer.ifRunning(),
        ));

    /** @test {Click.on} */
    it('allows the actor to click on an element', () =>
        actorCalled('Wendy').attemptsTo(
            VisitPage('no_spam_form'),
            Ensure.that(Form.Checkbox, not(isSelected())),

            Click.on(Form.Checkbox),

            Ensure.that(Form.Checkbox, isSelected()),
        ));

    /** @test {Click#toString} */
    it('provides a sensible description of the interaction being performed', () => {
        expect(Click.on(Form.Checkbox).toString())
            .to.equal('#actor clicks on the checkbox');
    });
});
