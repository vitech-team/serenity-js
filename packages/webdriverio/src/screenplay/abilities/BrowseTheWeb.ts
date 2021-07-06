import { Ability, UsesAbilities } from '@serenity-js/core';
import type { Browser } from 'webdriverio';

/**
 * @desc
 *  An {@link @serenity-js/core/lib/screenplay~Ability} that enables the {@link @serenity-js/core/lib/screenplay/actor~Actor}
 *  to interact with Web apps using [WebdriverIO](https://webdriver.io/).
 *
 *  *Please note*: this class is still experimental, which means that its interface can change without affecting the major version
 *  of Serenity/JS itself.
 *
 * @experimental
 *
 * @example <caption>Using the protractor.browser</caption>
 *  import { Actor } from '@serenity-js/core';
 *  import { BrowseTheWeb, by, Navigate, Target } from '@serenity-js/webdriverio'
 *  import { Ensure, equals } from '@serenity-js/assertions';
 *
 *  const actor = Actor.named('Wendy').whoCan(
 *      BrowseTheWeb.using(browser),
 *  );
 *
 *  const HomePage = {
 *      Title: Target.the('title').located(by.css('h1')),
 *  };
 *
 *  actor.attemptsTo(
 *      Navigate.to(`https://serenity-js.org`),
 *      Ensure.that(Text.of(HomePage.Title), equals('Serenity/JS')),
 *  );
 *
 * @see https://webdriver.io/
 *
 * @public
 * @implements {@serenity-js/core/lib/screenplay~Ability}
 * @see {@link @serenity-js/core/lib/screenplay/actor~Actor}
 */
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
