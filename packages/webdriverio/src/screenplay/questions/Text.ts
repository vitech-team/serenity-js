import { Answerable, AnswersQuestions, MetaQuestion, Question, UsesAbilities } from '@serenity-js/core';
import type { Element, ElementArray } from 'webdriverio';

import { TargetNestedElement, TargetNestedElements } from './targets';

export class Text {
    static of(element: Answerable<Element<'async'>>): Question<Promise<string>> & MetaQuestion<Answerable<Element<'async'>>, Promise<string>> {
        return new TextOfSingleElement(element);
    }

    static ofAll(elements: Answerable<ElementArray>): Question<Promise<string[]>> & MetaQuestion<Answerable<Element<'async'>>, Promise<string[]>> {
        return new TextOfMultipleElements(elements);
    }
}

class TextOfSingleElement
    extends Question<Promise<string>>
    implements MetaQuestion<Answerable<Element<'async'>>, Promise<string>>
{
    constructor(private readonly element: Answerable<Element<'async'>>) {
        super(`the text of ${ element }`);
    }

    of(parent: Answerable<Element<'async'>>): Question<Promise<string>> {
        return new TextOfSingleElement(new TargetNestedElement(parent, this.element));
    }

    answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string> {
        return actor.answer(this.element)
            .then(element => element.getText())
    }
}

class TextOfMultipleElements
    extends Question<Promise<string[]>>
    implements MetaQuestion<Answerable<Element<'async'>>, Promise<string[]>>
{
    constructor(private readonly elements: Answerable<ElementArray>) {
        super(`the text of ${ elements }`);
    }

    of(parent: Answerable<Element<'async'>>): Question<Promise<string[]>> {
        return new TextOfMultipleElements(new TargetNestedElements(parent, this.elements));
    }

    async answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string[]> {
        const elements = await actor.answer(this.elements);
        return await Promise.all(elements.map(answer => answer.getText()));
    }
}
