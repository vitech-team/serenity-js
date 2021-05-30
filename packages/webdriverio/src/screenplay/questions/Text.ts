import { Answerable, AnswersQuestions, MetaQuestion, Question, UsesAbilities } from '@serenity-js/core';
import type { Element, ElementArray } from 'webdriverio';

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

class TargetNestedElement
    extends Question<Promise<Element<'async'>>>
    implements MetaQuestion<Answerable<Element<'async'>>, Promise<Element<'async'>>>
{
    constructor(
        private readonly parent: Answerable<Element<'async'>>,
        private readonly child: Answerable<Element<'async'>>,
    ) {
        super(`${ child } of ${ parent }`);
    }
    of(parent: Answerable<Element<'async'>>): Question<Promise<Element<'async'>>> {
        return new TargetNestedElement(parent, this);
    }

    async answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<Element<'async'>> {
        const parent = await actor.answer(this.parent);
        const child  = await actor.answer(this.child);

        return parent.$(child.selector);
    }
}

class TargetNestedElements
    extends Question<Promise<ElementArray>>
    implements MetaQuestion<Answerable<Element<'async'>>, Promise<ElementArray>>
{
    constructor(
        private readonly parent: Answerable<Element<'async'>>,
        private readonly children: Answerable<ElementArray>,
    ) {
        super(`${ children } of ${ parent }`);
        // todo: add list interfaces
    }
    of(parent: Answerable<Element<'async'>>): Question<Promise<ElementArray>> {
        return new TargetNestedElements(parent, this);
    }

    async answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<ElementArray> {
        const parent   = await actor.answer(this.parent);
        const children = await actor.answer(this.children);

        return parent.$$(children.selector);
    }
}
