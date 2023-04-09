export class Uint8ArrayReader {
  pos: number;
  constructor(public buf: Uint8Array, public start: number = 0, public end: number = buf.length) {
    this.pos = start;
  }
  eof(): boolean {
    return this.pos >= this.buf.length;
  }
  readBytes(length: number): Uint8ArrayReader {
    this.assertBounds(length);
    const result = new Uint8ArrayReader(this.buf, this.pos, this.pos + length -1);
    this.pos += length;
    return result;
  }

  private assertBounds(length: number) {
    if (this.pos < this.start || this.pos + length > this.buf.length) {
      throw new Error('Reading operation will lead to out of bounds.');
    }
  }

  readVarint32(): number {
    let result = 0;
    let index = 0
    for (; index < 4; index++) {
      this.assertBounds(index + 1);
      const byte = this.buf[this.pos + index];
      result |= (byte & 0x7f) << (7 * index);
      if((byte & 0x80) === 0) {
        break;
      }
    }
    this.pos += index + 1;
    return result;
  }
  readUint24(): number {
    this.assertBounds(4);
    const result = this.buf[this.pos] | (this.buf[this.pos + 1] << 8) | (this.buf[this.pos + 2] << 16);
    this.pos += 3;
    return result;
  }
  readUint8(): number {
    this.assertBounds(1);
    const result = this.buf[this.pos];
    this.pos += 1;
    return result;
  }
  slice(): Uint8Array {
    return this.buf.slice(this.start, this.end + 1);
  }
}
