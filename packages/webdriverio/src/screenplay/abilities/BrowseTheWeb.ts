import { Ability, UsesAbilities } from '@serenity-js/core';
// import { Browser, MultiRemoteBrowser } from 'webdriverio';

export class BrowseTheWeb implements Ability {
    static using(browserInstance: any /*Browser<'async'>  todo: support MultiRemoteBrowser<'async'> */) {
        return new BrowseTheWeb(browserInstance);
    }

    static as(actor: UsesAbilities): BrowseTheWeb {
        return actor.abilityTo(BrowseTheWeb);
    }

    constructor(private readonly browserInstance: any /* Browser<'async'> /* todo: support MultiRemoteBrowser<'async'> */) {
    }

    get(destination: string): Promise<void> {
        return this.browserInstance.url(destination);  // todo: check if this returns a string or is mistyped
    }
}
