import 'mocha';

import { expect } from '@integration/testing-tools';
import { Ensure } from '@serenity-js/assertions';
import { actorCalled, AssertionError } from '@serenity-js/core';

import { by, isVisible, Navigate, Target, Wait } from '../../src';

describe('isVisible', function () {

    const Page = {
        Visible_Header:        Target.the('header').located(by.tagName('h1')),
        Invisible_Header:      Target.the('invisible header').located(by.tagName('h2')),
        Non_Existent_Header:   Target.the('non-existent header').located(by.tagName('h3')),
    };

    beforeEach(() =>
        actorCalled('Wendy').attemptsTo(
            Navigate.to('/expectations/is-visible/visibility.html'),
        ));

    /** @test {isVisible} */
    it('allows the actor flow to continue when the element is visible', () =>
        expect(actorCalled('Wendy').attemptsTo(
            Wait.until(Page.Visible_Header, isVisible()),
            Ensure.that(Page.Visible_Header, isVisible()),
        )).to.be.fulfilled);

    /** @test {isVisible} */
    it('breaks the actor flow when element is not visible', () =>
        expect(actorCalled('Wendy').attemptsTo(
            Ensure.that(Page.Invisible_Header, isVisible()),
        )).to.be.rejectedWith(AssertionError, `Expected the invisible header to become visible`));

    /** @test {isVisible} */
    it('breaks the actor flow when element does not exist', () =>
        expect(actorCalled('Wendy').attemptsTo(
            Ensure.that(Page.Non_Existent_Header, isVisible()),
        )).to.be.rejectedWith(AssertionError, `Expected the non-existent header to become visible`));

    /** @test {isVisible} */
    it('contributes to a human-readable description of an assertion', () => {
        expect(Ensure.that(Page.Visible_Header, isVisible()).toString())
            .to.equal(`#actor ensures that the header does become visible`);
    });

    /** @test {isVisible} */
    it('contributes to a human-readable description of a wait', () => {
        expect(Wait.until(Page.Visible_Header, isVisible()).toString())
            .to.equal(`#actor waits up to 5s until the header does become visible`);
    });
});
