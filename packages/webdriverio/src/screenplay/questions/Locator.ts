import type { Browser, Element, ElementArray } from 'webdriverio';
import { Question } from '@serenity-js/core';
import { BrowseTheWeb } from '../abilities';

export class Locator {
    constructor(
        private readonly description: string,
        private readonly findOne: (browserInstance: Browser<'async'>) => Promise<Element<'async'>>,
        private readonly findAll: (browserInstance: Browser<'async'>) => Promise<ElementArray>,
    ) {
    }

    firstMatching(): Question<Promise<Element<'async'>>> {
        return Question.about(this.description, actor =>
            this.findOne(BrowseTheWeb.as(actor).browser)
        )
    }

    allMatching(): Question<Promise<ElementArray>> {
        return Question.about(this.description, actor =>
            this.findAll(BrowseTheWeb.as(actor).browser)
        )
    }
}
