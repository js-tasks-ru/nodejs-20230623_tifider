const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.spareChuncks = '';
  }

  _transform(chunk, encoding, callback) {
    const chunkString = chunk.toString();

    if (!chunkString.includes(os.EOL)) {
      this.spareChuncks += chunkString;
    } else {
      const chunkArray = chunkString.split(os.EOL);
      chunkArray[0] = this.spareChuncks + chunkArray[0];
      this.spareChuncks = '';
      for (let i = 0; i < chunkArray.length - 1; i++) {
        this.push(chunkArray[i]);
      }
      this.spareChuncks = chunkArray[chunkArray.length - 1];
    }

    callback();
  }

  _flush(callback) {
    this.push(this.spareChuncks);
    callback();
  }
}

module.exports = LineSplitStream;
