import { OutputStream } from '@serenity-js/core/lib/io';

/**
 * @package
 */
export class BufferedOutputStream implements OutputStream {
    private buffer = '';

    constructor(
        private readonly prefix: string,
        private readonly outputStream: OutputStream,
    ) {
    }

    write(content: string): void {
        const [ head, ...tail ] = content.split('\n');

        this.buffer += head;

        // no new line character, buffer content
        if (tail.length === 0) {
            return;
        }

        // write line
        this.outputStream.write(`${ this.prefix } ${ this.buffer }\n`);

        this.buffer = tail.pop()

        tail.forEach(line => {
            this.outputStream.write(`${ this.prefix } ${ line }\n`);
        });
    }
}
