import 'mocha';

import { expect } from '@integration/testing-tools';
import { Ensure } from '@serenity-js/assertions';
import { actorCalled, AssertionError } from '@serenity-js/core';

import { by, isSelected, Navigate, Target, Wait } from '../../src';

describe('isSelected', function () {

    const Languages = {
        TypeScript: Target.the('TypeScript option').located(by.css('select[name="languages"] > option[value="TypeScript"]')),
        JavaScript: Target.the('JavaScript option').located(by.css('select[name="languages"] > option[value="JavaScript"]')),
        Java:       Target.the('Java option').located(by.css('select[name="languages"] > option[value="Java"]')),
    };

    beforeEach(() =>
        actorCalled('Wendy').attemptsTo(
            Navigate.to('/expectations/is-selected/programming_languages.html'),
        ));

    /** @test {isSelected} */
    it('allows the actor flow to continue when the element is selected', () =>
        expect(actorCalled('Wendy').attemptsTo(
            Wait.until(Languages.TypeScript, isSelected()),
            Ensure.that(Languages.TypeScript, isSelected()),
        )).to.be.fulfilled);

    /** @test {isSelected} */
    it('breaks the actor flow when element is not selected', () =>
        expect(actorCalled('Wendy').attemptsTo(
            Ensure.that(Languages.JavaScript, isSelected()),
        )).to.be.rejectedWith(AssertionError, `Expected the JavaScript option to become selected`));

    /** @test {isSelected} */
    it('breaks the actor flow when element is not present', () =>
        expect(actorCalled('Wendy').attemptsTo(
            Ensure.that(Languages.Java, isSelected()),
        )).to.be.rejectedWith(AssertionError, `Expected the Java option to become selected (Can't call isSelected on element with selector "select[name="languages"] > option[value="Java"]" because element wasn't found)`));

    /** @test {isSelected} */
    it('contributes to a human-readable description of an assertion', () => {
        expect(Ensure.that(Languages.TypeScript, isSelected()).toString())
            .to.equal(`#actor ensures that the TypeScript option does become selected`);
    });

    /** @test {isSelected} */
    it('contributes to a human-readable description of a wait', () => {
        expect(Wait.until(Languages.TypeScript, isSelected()).toString())
            .to.equal(`#actor waits up to 5s until the TypeScript option does become selected`);
    });
});
