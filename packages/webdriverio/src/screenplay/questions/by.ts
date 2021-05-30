import type { Selector } from 'webdriverio';
import { Locator } from './Locator';

export const by = {
    css(selector: Selector): Locator {
        return new Locator(
            `by css ${ selector }`,
            browser => browser.$(selector),
            browser => browser.$$(selector),
        )
    },

    tagName(tagName: string): Locator {
        return new Locator(
            `by tag name <${ tagName } />`,
            browser => browser.$(`<${ tagName } />`),
            browser => browser.$$(`<${ tagName } />`),
        )
    }
}
