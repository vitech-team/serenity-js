import { Answerable, AnswersQuestions, Interaction, LogicError } from '@serenity-js/core';
import { Element } from 'webdriverio';
import { formatted } from '@serenity-js/core/lib/io';

/**
 * @desc
 *  A base class for WebdriverIO-specific interactions
 *
 * @extends {@serenity-js/core/lib/screenplay~Interaction}
 */
export abstract class WebElementInteraction extends Interaction {
    constructor(private readonly description: string) {
        super();
    }

    /**
     * @desc
     *  Returns the resolved {@}
     *
     * @param actor
     * @param element
     * @protected
     */
    protected async resolve<O>(
        actor: AnswersQuestions,
        element: Answerable<Element<'async'>>,
    ): Promise<Element<'async'>> {
        const resolved = await actor.answer(element);

        if (! resolved) {
            throw new LogicError(formatted `Couldn't find ${ element }`);
        }

        return resolved;
    }

    /**
     * @desc
     *  Generates a description to be used when reporting this {@link @serenity-js/core/lib/screenplay~Activity}.
     *
     * @returns {string}
     */
    toString(): string {
        return this.description;
    }
}
