import { Capabilities, Options, Reporters } from '@wdio/types';
import Reporter from '@wdio/reporter';
import { Tag } from '@serenity-js/core/lib/model';
import { Serenity } from '@serenity-js/core';
import { SceneTagged } from '@serenity-js/core/lib/events';
import { TagPrinter } from './TagPrinter';

/**
 * - Spec Reporter
 *  - https://github.com/webdriverio/webdriverio/blob/69c66bf904ae9a6b7e3c40e7fc43e9c3a79d847a/packages/wdio-spec-reporter/src/index.ts#L412-L456
 */
export class BrowserCapabilitiesReporter extends Reporter {

    private readonly tagPrinter = new TagPrinter();
    private readonly serenity: Serenity;

    private readonly tags: Tag[] = [];

    constructor (options: Partial<Reporters.Options> & { serenity: Serenity }) {
        super({ ...options, stdout: false });

        this.serenity = options.serenity;

        this.on('runner:start', this.recordBrowserAndPlatformTags.bind(this));
        this.on('test:start',   this.emitRecordedTags.bind(this));
    }

    private recordBrowserAndPlatformTags(event: Options.RunnerStart) {
        const tags = event.isMultiremote
            ? this.tagsForAll(event.capabilities as unknown as Record<string, Capabilities.DesiredCapabilities | Capabilities.W3CCapabilities>)  // fixme: WDIO MultiremoteCapabilities seem to have incorrect definition?
            : this.tagPrinter.tagsFor(event.capabilities)

        this.tags.push(...tags);
    }

    private tagsForAll(capabilities: Record<string, Capabilities.DesiredCapabilities | Capabilities.W3CCapabilities>): Tag[] {
        return Object.keys(capabilities)
            .reduce((existingTags, entryName) => {

                const newTags       = this.tagPrinter.tagsFor(capabilities[entryName]);
                const uniqueNewTags = newTags.filter(tag => ! existingTags.some((existingTag: Tag) => existingTag.equals(tag)));

                return [
                    ...existingTags,
                    // todo: maybe add some additional tag to indicate the custom capability name,
                    //  or the fact that it's a multi-remote scenario?
                    ...uniqueNewTags,
                ];
            }, []);
    }

    private emitRecordedTags() {
        this.tags.forEach(tag => {
            this.serenity.announce(
                new SceneTagged(
                    this.serenity.currentSceneId(),
                    tag,
                    this.serenity.currentTime(),
                )
            )
        })
    }
}
