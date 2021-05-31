import { Locator } from './Locator';
import type { Element, ElementArray } from 'webdriverio';
import { Answerable, AnswersQuestions, MetaQuestion, Question, UsesAbilities } from '@serenity-js/core';

export class Target {
    static the(description: string) {
        return {
            located(locator: Locator): Question<Promise<Element<'async'>>> {
                return locator.firstMatching().describedAs(`the ${ description }`);
            }
        }
    }

    static all(description: string) {
        return {
            located(locator: Locator): Question<Promise<ElementArray>> {
                return locator.allMatching().describedAs(description);
            }
        }
    }
}

export class TargetNestedElement
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

export class TargetNestedElements
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
