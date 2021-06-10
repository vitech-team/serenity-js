import { Answerable, AnswersQuestions, LogicError, MetaQuestion, Question, UsesAbilities } from '@serenity-js/core';
import { Element } from 'webdriverio';

import { TargetNestedElement } from './target';

export class Attribute
    extends Question<Promise<string>>
    implements MetaQuestion<Answerable<Element<'async'>>, Promise<string>>
{
    static called(name: Answerable<string>): Attribute {
        return new Attribute(name);
    }

    constructor(private readonly name: Answerable<string>, private readonly element?: Answerable<Element<'async'>>) {
        super(`"${ name }" attribute of ${ element }`);
    }

    of(target: Answerable<Element<'async'>>): Question<Promise<string>> {
        return new Attribute(
            this.name,
            this.element
                ? new TargetNestedElement(target, this.element)
                : target
        );
    }

    async answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string> {
        if (! this.element) {
            throw new LogicError(`Target not specified`);   // todo: better error message?
        }

        const element = await actor.answer(this.element);
        const name    = await actor.answer(this.name);

        return await element.getAttribute(name);
    }
}
