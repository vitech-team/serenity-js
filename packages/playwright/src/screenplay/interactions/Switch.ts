import {
    Activity,
    Answerable,
    AnswersQuestions,
    Interaction,
    PerformsActivities,
    Task,
    UsesAbilities,
} from '@serenity-js/core';
import { ElementHandle } from 'playwright';

import { BrowseTheWeb } from '../abilities';

/**
 * @desc
 *  Instructs the {@link @serenity-js/core/lib/screenplay/actor~Actor}
 *  to switch to a different [frame](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/frame),
 *  [inline frame](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe),
 *  or browser window/tab.
 *
 * @example <caption>Lean Page Object describing a login form, embedded in an iframe</caption>
 *
 *  import { Target } from '@serenity-js/playwright';
 *  import { by } from 'playwright';
 *
 *  class LoginForm {
 *      static iframe           = Target.the('login form').selectedBy('iframe');
 *      static usernameField    = Target.the('username field').selectedBy('id=username');
 *      static passwordField    = Target.the('password field').selectedBy('id=password');
 *      static submitButton     = Target.the('submit button').selectedBy(`id=submit`);
 *  }
 *
 * @example <caption>Switch to an iframe and back</caption>
 *
 *  import { actorCalled } from '@serenity-js/core';
 *  import { BrowseTheWeb, Switch, Enter, Click } from '@serenity-js/playwright';
 *  import { chromium } from 'playwright';
 *
 *  actorCalled('Francesca')
 *      .whoCan(BrowseTheWeb.using(chromium))
 *      .attemptsTo(
 *          Switch.toFrame(LoginForm.iframe),
 *
 *          Enter.theValue('francesca@example.org').into(LoginForm.usernameField),
 *          Enter.theValue('correct-horse-battery-staple').into(LoginForm.passwordField),
 *          Click.on(LoginForm.submitButton),
 *
 *          Switch.toParentFrame(),
 *      );
 *
 * @example <caption>Perform activities in the context of an iframe</caption>
 *
 *  import { actorCalled } from '@serenity-js/core';
 *  import { BrowseTheWeb, Switch, Enter, Click } from '@serenity-js/playwright';
 *  import { firefox } from 'playwright';
 *
 *  actorCalled('Francesca')
 *      .whoCan(BrowseTheWeb.using(firefox))
 *      .attemptsTo(
 *          Switch.toFrame(LoginForm.iframe).and(
 *              Enter.theValue('francesca@example.org').into(LoginForm.usernameField),
 *              Enter.theValue('correct-horse-battery-staple').into(LoginForm.passwordField),
 *              Click.on(LoginForm.submitButton),
 *          ),
 *          // Note that Switch.toParentFrame() is invoked automatically
 *      );
 *
 * @example <caption>Switch to a new window/tab and back</caption>
 *
 *  import { actorCalled } from '@serenity-js/core';
 *  import { BrowseTheWeb, Switch, Close } from '@serenity-js/playwright';
 *  import { chromium } from 'playwright';
 *
 *  actorCalled('Francesca')
 *      .whoCan(BrowseTheWeb.using(chromium))
 *      .attemptsTo(
 *          Switch.toNewWindow(), // or: Switch.toWindow(...)
 *
 *          // perform some activities in the context of the new window
 *
 *          Close.currentWindow(),
 *
 *          Switch.toOriginalWindow(),
 *      );
 *
 * @example <caption>Perform activities in the context of a different window/tab</caption>
 *
 *  import { actorCalled } from '@serenity-js/core';
 *  import { BrowseTheWeb, Switch, Close } from '@serenity-js/playwright';
 *  import { chromium } from 'playwright';
 *
 *  actorCalled('Francesca')
 *      .whoCan(BrowseTheWeb.using(chromium))
 *      .attemptsTo(
 *          Switch.toNewWindow().and(
 *              // perform some activities in the context of the new window
 *
 *              Close.currentWindow()
 *          ),
 *
 *          // Note that Switch.toOriginalWindow() is invoked automatically
 *      );
 *
 * @see {@link Close}
 * @see {@link BrowseTheWeb}
 */
export class Switch {
    /**
   * @desc
   *  Switches the current [browsing context](https://w3c.github.io/webdriver/#dfn-current-browsing-context)
   *  for future commands to a [frame](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/frame)
   *  or an [inline frame](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
   *  identified by its name, index or `Question<ElementHandle>`.
   *
   * @param {Answerable<ElementHandle | number | string>} targetOrIndex
   *
   * @returns {SwitchToFrame}
   *
   * @see {@link Switch.toParentFrame}
   * @see {@link Switch.toDefaultContent}
   * @see {@link Target}
   */
    static toFrame(
        targetOrIndex: Answerable<ElementHandle | number | string>
    ): SwitchToFrame {
        return new SwitchToFrame(targetOrIndex);
    }

    /**
   * @desc
   *  Sets the current [browsing context](https://w3c.github.io/webdriver/#dfn-current-browsing-context)
   *  for future commands to the parent of the current browsing context,
   *  i.e. an `iframe` in which the current `iframe` is nested.
   *
   *  If the current context is the top-level browsing context, the context remains unchanged.
   *
   * @returns {@serenity-js/core/lib/screenplay~Interaction}
   *
   * @see {@link Switch.toFrame}
   * @see https://w3c.github.io/webdriver/#switch-to-parent-frame
   * @see https://w3c.github.io/webdriver/#dfn-current-browsing-context
   */
    static toParentFrame(): Interaction {
        return new SwitchToParentFrame();
    }

    /**
   * @desc
   *  Switches the current [browsing context](https://w3c.github.io/webdriver/#dfn-current-browsing-context)
   *  for future commands to the first frame on the page, or the main document
   *  when a page contains [`iframe`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)s.
   *
   * @returns {@serenity-js/core/lib/screenplay~Interaction}
   *
   * @see {@link Switch.toFrame}
   */
    static toDefaultContent(): Interaction {
        return new SwitchToDefaultContent();
    }

    /**
   * @desc
   *  Switches the current [browsing context](https://w3c.github.io/webdriver/#dfn-current-browsing-context)
   *  for future commands to a browser tab/window identified by its
   *  name, index or [window handle](https://developer.mozilla.org/en-US/docs/Web/WebDriver/Commands/GetWindowHandles).
   *
   * @param {Answerable<string | number>} nameOrHandleOrIndex
   * @returns {SwitchToWindow}
   */
    static toWindow(
        nameOrHandleOrIndex: Answerable<string | number>
    ): SwitchToWindow {
        return new SwitchToWindow(nameOrHandleOrIndex);
    }

    /**
   * @desc
   *  Switches the current [browsing context](https://w3c.github.io/webdriver/#dfn-current-browsing-context)
   *  for future commands to the most recently opened browser tab/window.
   *
   *  **Please note** that this behaviour might vary in some browsers if there are more than two windows opened
   *  at the same time.
   *
   * @returns {SwitchToNewWindow}
   */
    static toNewWindow(): SwitchToNewWindow {
        return new SwitchToNewWindow();
    }

    /**
   * @desc
   *  Switches the current [browsing context](https://w3c.github.io/webdriver/#dfn-current-browsing-context)
   *  for future commands to the original window used when the {@link @serenity-js/core/lib/screenplay/actor~Actor}
   *  performed an interaction to {@link Navigate}.
   *
   *  **Please note** that this behaviour might vary in some browsers if there are more than two windows opened
   *  at the same time, as window handles might be ordered alphabetically instead of the order in which they were created.
   *
   * @returns {SwitchToOriginalWindow}
   */
    static toOriginalWindow(): SwitchToOriginalWindow {
        return new SwitchToOriginalWindow();
    }
}

/**
 * @package
 */
class SwitchToFrame extends Interaction {
    constructor(
        private readonly targetOrIndex: Answerable<ElementHandle | number | string>
    ) {
        super();
    }

    and(...activities: Activity[]): Task {
        return new SwitchToFrameAndPerformActivities(
            this.targetOrIndex,
            activities
        );
    }

    async performAs(actor: UsesAbilities & AnswersQuestions): Promise<void> {
        const targetOrIndex = await actor.answer(this.targetOrIndex);
        await BrowseTheWeb.as(actor).switchToFrame(targetOrIndex);
    }

    toString(): string {
        return `#actor switches to frame: ${this.targetOrIndex}`;
    }
}

/**
 * @package
 */
class SwitchToFrameAndPerformActivities extends Task {
    constructor(
        private readonly targetOrIndex: Answerable<ElementHandle | number | string>,
        private readonly activities: Activity[]
    ) {
        super();
    }

    performAs(actor: PerformsActivities): PromiseLike<void> {
        return actor.attemptsTo(
            new SwitchToFrame(this.targetOrIndex),
            ...this.activities,
            new SwitchToParentFrame()
        );
    }

    toString(): string {
        return `#actor switches to frame: ${this.targetOrIndex}`;
    }
}

/**
 * @package
 */
class SwitchToParentFrame extends Interaction {
    performAs(actor: UsesAbilities & AnswersQuestions): PromiseLike<void> {
        return BrowseTheWeb.as(actor).switchToParentFrame();
    }

    toString(): string {
        return `#actor switches to parent frame`;
    }
}

/**
 * @package
 */
class SwitchToDefaultContent extends Interaction {
    performAs(actor: UsesAbilities & AnswersQuestions): PromiseLike<void> {
        return BrowseTheWeb.as(actor).switchToDefaultContent();
    }

    toString(): string {
        return `#actor switches to default content`;
    }
}

/**
 * @package
 */
class SwitchToWindow extends Interaction {
    constructor(
        private readonly nameOrHandleOrIndex: Answerable<string | number>
    ) {
        super();
    }

    and(...activities: Activity[]): Task {
        return new SwitchToWindowAndPerformActivities(
            this.nameOrHandleOrIndex,
            activities
        );
    }

    performAs(actor: UsesAbilities & AnswersQuestions): PromiseLike<void> {
        return actor
      .answer(this.nameOrHandleOrIndex)
      .then((index) => BrowseTheWeb.as(actor).switchToWindow(index));
    }

    toString(): string {
        return `#actor switches to window: ${this.nameOrHandleOrIndex}`;
    }
}

/**
 * @package
 */
class SwitchToWindowAndPerformActivities extends Task {
    constructor(
        private readonly nameOrHandleOrIndex: Answerable<string | number>,
        private readonly activities: Activity[]
    ) {
        super();
    }

    async performAs(actor: PerformsActivities & UsesAbilities): Promise<void> {
        await BrowseTheWeb.as(actor).memorizeContext();
        await actor.attemptsTo(
            new SwitchToWindow(this.nameOrHandleOrIndex),
            ...this.activities,
            switchToPreviousWindow()
        );
    }

    toString(): string {
        return `#actor switches to window: ${this.nameOrHandleOrIndex}`;
    }
}

/**
 * @package
 */
class SwitchToNewWindow extends Interaction {
    constructor() {
        super();
    }

    and(...activities: Activity[]): Task {
        return new SwitchToNewWindowAndPerformActivities(activities);
    }

    async performAs(actor: UsesAbilities & AnswersQuestions): Promise<void> {
        await BrowseTheWeb.as(actor).switchToLastOpenedWindow();
    }

    toString(): string {
        return `#actor switches to the new browser window`;
    }
}

/**
 * @package
 */
class SwitchToNewWindowAndPerformActivities extends Task {
    constructor(private readonly activities: Activity[]) {
        super();
    }

    async performAs(actor: PerformsActivities & UsesAbilities): Promise<void> {
        await BrowseTheWeb.as(actor).memorizeContext();
        await actor.attemptsTo(
            new SwitchToNewWindow(),
            ...this.activities,
            switchToPreviousWindow()
        );
    }

    toString(): string {
        return `#actor switches to the new window`;
    }
}

/**
 * @package
 */
class SwitchToOriginalWindow extends Interaction {
    constructor() {
        super();
    }

    performAs(actor: UsesAbilities & AnswersQuestions): PromiseLike<void> {
        return BrowseTheWeb.as(actor).switchToOriginalWindow();
    }

    toString(): string {
        return `#actor switches back to the original browser window`;
    }
}

const switchToPreviousWindow = () => ({
    performAs: (actor: UsesAbilities & AnswersQuestions) =>
        BrowseTheWeb.as(actor).restoreContext(),
    toString: () => `#actor switches back to the previous window`,
});
