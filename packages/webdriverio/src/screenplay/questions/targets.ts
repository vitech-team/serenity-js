/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Answerable, AnswersQuestions, Expectation, List, MetaQuestion, Question, UsesAbilities } from '@serenity-js/core';
import type { Element, ElementArray } from 'webdriverio';

import { ElementArrayListAdapter } from './lists';
import { Locator } from './locators';

export class Target {
    static the(description: string) {
        return {
            // todo: add TargetBuilder interfaces
            located(locator: Locator): TargetElement {
                return new TargetElement(`the ${ description }`, locator);
            },

            of(parent: Answerable<Element<'async'>>) {
                return {
                    located(locator: Locator): TargetNestedElement {
                        return new TargetNestedElement(parent, new TargetElement(description, locator));
                    }
                }
            }
        }
    }

    static all(description: string) {
        return {
            located(locator: Locator): TargetElements {
                return new TargetElements(description, locator);
            },

            of(parent: Answerable<Element<'async'>>) {
                return {
                    located(locator: Locator): TargetNestedElements {
                        return new TargetNestedElements(parent, new TargetElements(description, locator));
                    }
                }
            }
        }
    }
}

export class TargetElements
    extends Question<Promise<ElementArray>>
    implements MetaQuestion<Answerable<Element<'async'>>, Promise<ElementArray>>
{
    private readonly list: List<ElementArrayListAdapter, Promise<Element<'async'>>, Promise<ElementArray>>;

    constructor(
        description: string,
        private readonly locator: Locator,
    ) {
        super(description);
        this.list = new List(new ElementArrayListAdapter(this));
    }

    of(parent: Answerable<Element<'async'>>): TargetNestedElements {
        return new TargetNestedElements(parent, this);
    }

    count(): Question<Promise<number>> {
        return this.list.count();
    }

    first(): Question<Promise<Element<'async'>>> {
        return this.list.first()
    }

    last(): Question<Promise<Element<'async'>>> {
        return this.list.last()
    }

    get(index: number): Question<Promise<Element<'async'>>> {
        return this.list.get(index);
    }

    where<Answer_Type>(
        question: MetaQuestion<Answerable<Element<'async'>>, Promise<Answer_Type> | Answer_Type>,
        expectation: Expectation<any, Answer_Type>,
    ): List<ElementArrayListAdapter, Promise<Element<'async'>>, Promise<ElementArray>> {
        return this.list.where(question, expectation);
    }

    answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<ElementArray> {
        return this.locator.allMatching()
            .describedAs(this.subject)
            .answeredBy(actor);
    }
}

export class TargetNestedElements
    extends Question<Promise<ElementArray>>
    implements MetaQuestion<Answerable<Element<'async'>>, Promise<ElementArray>>
{
    private readonly list: List<ElementArrayListAdapter, Promise<Element<'async'>>, Promise<ElementArray>>;

    constructor(
        private readonly parent: Answerable<Element<'async'>>,
        private readonly children: Answerable<ElementArray>,
    ) {
        super(`${ children } of ${ parent }`);
        this.list = new List(new ElementArrayListAdapter(this));
    }

    of(parent: Answerable<Element<'async'>>): Question<Promise<ElementArray>> {
        return new TargetNestedElements(parent, this);
    }

    count(): Question<Promise<number>> {
        return this.list.count();
    }

    first(): Question<Promise<Element<'async'>>> {
        return this.list.first()
    }

    last(): Question<Promise<Element<'async'>>> {
        return this.list.last()
    }

    get(index: number): Question<Promise<Element<'async'>>> {
        return this.list.get(index);
    }

    where<Answer_Type>(
        question: MetaQuestion<Answerable<Element<'async'>>, Promise<Answer_Type> | Answer_Type>,
        expectation: Expectation<any, Answer_Type>,
    ): List<ElementArrayListAdapter, Promise<Element<'async'>>, Promise<ElementArray>> {
        return this.list.where(question, expectation);
    }

    async answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<ElementArray> {
        const parent   = await actor.answer(this.parent);
        const children = await actor.answer(this.children);

        return parent.$$(children.selector);
    }
}

export class TargetElement
    extends Question<Promise<Element<'async'>>>
    implements MetaQuestion<Answerable<Element<'async'>>, Promise<Element<'async'>>>
{
    constructor(
        description: string,
        private readonly locator: Locator,
    ) {
        super(description);
    }

    of(parent: Answerable<Element<'async'>>): Question<Promise<Element<'async'>>> {
        return new TargetNestedElement(parent, this);
    }

    answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<Element<'async'>> {
        return this.locator.firstMatching()
            .describedAs(this.subject)
            .answeredBy(actor);
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
