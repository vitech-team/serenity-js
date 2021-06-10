import { Ability, UsesAbilities } from '@serenity-js/core';
import type { Browser } from 'webdriverio';

export class BrowseTheWeb implements Ability {
    static using(browserInstance: Browser<'async'>): BrowseTheWeb {
        return new BrowseTheWeb(browserInstance);
    }

    static as(actor: UsesAbilities): BrowseTheWeb {
        return actor.abilityTo(BrowseTheWeb);
    }

    constructor(public readonly browser: Browser<'async'>) {
    }

    get(destination: string): Promise<void> {
        return this.browser.url(destination) as any;  // todo: check if this returns a string or is mistyped
    }
}
