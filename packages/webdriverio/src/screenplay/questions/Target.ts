import { Locator } from './Locator';
import type { Element, ElementArray } from 'webdriverio';
import { Question } from '@serenity-js/core';

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
