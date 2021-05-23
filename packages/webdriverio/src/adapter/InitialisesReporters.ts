import { Reporters } from '@wdio/types';

export interface InitialisesReporters {
    initReporter(reporter: Reporters.ReporterEntry): void;
}
