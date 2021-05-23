import { OutputStream } from '@serenity-js/core/lib/io';

export interface ProvidesWriteStream {
    getWriteStreamObject(reporter: string): OutputStream;
}
