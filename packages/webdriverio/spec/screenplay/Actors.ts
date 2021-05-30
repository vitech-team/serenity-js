import { Actor, Cast, TakeNotes } from '@serenity-js/core';
import { ManageALocalServer } from '@serenity-js/local-server';
import { CallAnApi } from '@serenity-js/rest';
import axios from 'axios';
import { Browser } from 'webdriverio';
import { BrowseTheWeb } from '../../src';
import { app } from '../../../protractor/spec/pages';

/*
 * NYC confuses WebdriverIO's ts-node loader (probably because it runs in a child process https://github.com/istanbuljs/nyc/issues/635)
 * Because of this, worker processes can't find 'webdriverio/async', which then leads to TypeScript complaining about the global "browser" being undefined.
 *
 * This type definition works around this problem.
 */
declare global {
    namespace NodeJS {
        interface Global {
            browser: Browser<'async'>
        }
    }
}

export class Actors implements Cast {
    prepare(actor: Actor): Actor {
        return actor.whoCan(
            BrowseTheWeb.using(global.browser),
            TakeNotes.usingAnEmptyNotepad(),
            ManageALocalServer.runningAHttpListener(app),
            CallAnApi.using(axios.create()),
        );
    }
}
