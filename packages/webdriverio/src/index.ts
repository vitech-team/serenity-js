import { serenity } from '@serenity-js/core';
import { WebdriverIOFrameworkAdapterFactory } from './adapter';
import { ModuleLoader } from '@serenity-js/core/lib/io';

const adapterFactory = new WebdriverIOFrameworkAdapterFactory(serenity, new ModuleLoader(process.cwd()));
export default adapterFactory;

// export default function reporter(config: SerenityConfig) {
//     return new SerenityReporterForWebdriverIO(serenity, config);
// }

export * from './screenplay'
