import { Ability, UsesAbilities } from '@serenity-js/core';
import type { Browser } from 'webdriverio';

/**
 * @desc
 *  An {@link @serenity-js/core/lib/screenplay~Ability} that enables the {@link @serenity-js/core/lib/screenplay/actor~Actor}
 *  to interact with Web apps using [WebdriverIO](https://webdriver.io/).
 *
 *  *Please note*: this class is still marked as experimental while new WebdriverIO Interactions and Questions are being developed.
 *  This means that its interface can change without affecting the major version of Serenity/JS itself.
 *
 * @experimental
 *
 * @example <caption>Using the WebdriverIO browser</caption>
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
    /**
     * @param {@wdio/types~Browser} browserInstance
     * @returns {BrowseTheWeb}
     */
    static using(browserInstance: Browser<'async'>): BrowseTheWeb {
        return new BrowseTheWeb(browserInstance);
    }

    /**
     * @desc
     *  Used to access the Actor's ability to {@link BrowseTheWeb}
     *  from within the {@link @serenity-js/core/lib/screenplay~Interaction} classes,
     *  such as {@link Navigate}.
     *
     * @param {@serenity-js/core/lib/screenplay/actor~UsesAbilities} actor
     * @return {BrowseTheWeb}
     */
    static as(actor: UsesAbilities): BrowseTheWeb {
        return actor.abilityTo(BrowseTheWeb);
    }

    /**
     * @param {@wdio/types~Browser} browser
     */
    constructor(public readonly browser: Browser<'async'>) {
    }

    /**
     * @desc
     *  Navigate to a given destination, specified as an absolute URL
     *  or a path relative to WebdriverIO `baseUrl`.
     *
     * @param {string} destination
     * @returns {Promise<void>}
     */
    get(destination: string): Promise<void> {
        return this.browser.url(destination) as any;  // todo: check if this returns a string or is mistyped
    }
}
