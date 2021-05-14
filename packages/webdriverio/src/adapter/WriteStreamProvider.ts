import { OutputStream } from '@serenity-js/core/lib/io';

export interface WriteStreamProvider {
    getWriteStreamObject(reporter: string): OutputStream
}
