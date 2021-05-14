import 'mocha';
import * as sinon from 'sinon';
import { BufferedOutputStream } from '../../src/adapter/BufferedOutputStream';
import { expect } from '@integration/testing-tools';

describe('DecoratedOutputStream', () => {

    let write:  sinon.SinonSpy,
        buffer: BufferedOutputStream;

    beforeEach(() => {
        write   = sinon.spy();
        buffer  = new BufferedOutputStream('[prefix]', { write });
    });

    it(`does not write the content if there's no new line character`, () => {
        buffer.write('Hello');
        buffer.write(' ');
        buffer.write('World');

        expect(write).to.not.have.been.called;
    });

    it('buffers the content and writes it to outputStream upon new line character', () => {
        buffer.write('Hello');
        buffer.write(' ');
        buffer.write('World');
        buffer.write('!');
        buffer.write('\n');

        expect(write).to.have.been.calledWith('[prefix] Hello World!\n');
    });

    it('buffers the content and writes it to outputStream one line at a time', () => {
        buffer.write('I see skies of blue');
        buffer.write(' ');
        buffer.write('and clouds of white.\n');
        buffer.write('The bright blessed day,\n');
        buffer.write('The dark sacred night');
        buffer.write('\n');

        expect(write).to.have.been.calledWith('[prefix] I see skies of blue and clouds of white.\n');
        expect(write).to.have.been.calledWith('[prefix] The bright blessed day,\n');
        expect(write).to.have.been.calledWith('[prefix] The dark sacred night\n');
    });
});
