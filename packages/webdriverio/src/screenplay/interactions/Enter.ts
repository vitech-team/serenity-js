import { Answerable, AnswersQuestions, Interaction, UsesAbilities } from '@serenity-js/core';
import { formatted } from '@serenity-js/core/lib/io';
import { Element } from 'webdriverio';

/**
 * @desc
 *  Instructs the {@link @serenity-js/core/lib/screenplay/actor~Actor} to
 *  enter a value into a [form `input`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) field.
 *
 * @example <caption>Example widget</caption>
 *  <form>
 *    <input type="text" name="example" id="example" />
 *  </form>
 *
 * @example <caption>Lean Page Object describing the widget</caption>
 *  import { by, Target } from '@serenity-js/webdriverio';
 *
 *  class Form {
 *      static exampleInput = Target.the('example input')
 *          .located(by.id('example'));
 *  }
 *
 * @example <caption>Entering the value into a form field</caption>
 *  import { actorCalled } from '@serenity-js/core';
 *  import { BrowseTheWeb, Enter } from '@serenity-js/protractor';
 *  import { protractor } from 'protractor';
 *
 *  actorCalled('Esme')
 *      .whoCan(BrowseTheWeb.using(protractor.browser))
 *      .attemptsTo(
 *          Enter.theValue('Hello world!').into(Form.exampleInput),
 *      );
 *
 * @see {@link Target}
 *
 * @extends {@serenity-js/core/lib/screenplay~Interaction}
 */
export class Enter extends Interaction {

    /**
     * @desc
     *  Instantiates this {@link @serenity-js/core/lib/screenplay~Interaction}.
     *
     * @param {Array<Answerable<string | number | string[] | number[]>>} value
     *  The value to be entered
     *
     * @returns {EnterBuilder}
     */
    static theValue(...value: Array<Answerable<string | number | string[] | number[]>>): EnterBuilder {
        return {
            into: (field: Answerable<Element<'async'>>  /* todo Question<AlertPromise> | AlertPromise */) =>
                new Enter(value, field),
        };
    }

    /**
     * @param {Array<Answerable<string | number | string[] | number[]>>} value
     *  The value to be entered
     *
     * @param {Answerable<Element<'async'>>} field
     *  The field to enter the value into
     */
    constructor(
        private readonly value: Array<Answerable<string | number | string[] | number[]>>,
        private readonly field: Answerable<Element<'async'>> /* todo | Question<AlertPromise> | AlertPromise */,
    ) {
        super();
    }

    /**
     * @desc
     *  Makes the provided {@link @serenity-js/core/lib/screenplay/actor~Actor}
     *  perform this {@link @serenity-js/core/lib/screenplay~Interaction}.
     *
     * @param {UsesAbilities & AnswersQuestions} actor
     *  An {@link @serenity-js/core/lib/screenplay/actor~Actor} to perform this {@link @serenity-js/core/lib/screenplay~Interaction}
     *
     * @returns {Promise<void>}
     *
     * @see {@link @serenity-js/core/lib/screenplay/actor~Actor}
     * @see {@link @serenity-js/core/lib/screenplay/actor~UsesAbilities}
     * @see {@link @serenity-js/core/lib/screenplay/actor~AnswersQuestions}
     */
    async performAs(actor: UsesAbilities & AnswersQuestions): Promise<void> {
        const values = await Promise.all(this.value.map(part => actor.answer(part)));
        const field: Element<'async'> = await actor.answer(this.field);

        return field.addValue(values.flat());   // addValue rather than setValue so that the behaviour is consistent with Selenium sendKeys
    }

    /**
     * @desc
     *  Generates a description to be used when reporting this {@link @serenity-js/core/lib/screenplay~Activity}.
     *
     * @returns {string}
     */
    toString(): string {
        return formatted `#actor enters ${ this.value.join(', ') } into ${ this.field }`;
    }
}

/**
 * @desc
 *  Fluent interface to make the instantiation of
 *  the {@link @serenity-js/core/lib/screenplay~Interaction}
 *  to {@link Enter} more readable.
 *
 * @see {@link Enter}
 *
 * @interface
 */
export interface EnterBuilder {

    /**
     * @desc
     *  Instantiates an {@link @serenity-js/core/lib/screenplay~Interaction}
     *  to {@link Enter}.
     *
     * @param {Answerable<Element<'async'>>} field
     * @returns {@serenity-js/core/lib/screenplay~Interaction}
     *
     * @see {@link Target}
     */
    into: (field: Answerable<Element<'async'>> /* | Question<AlertPromise> | AlertPromise */) => Interaction;
}
