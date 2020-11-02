const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
    constructor(options) {
        super(options);
    }

    _transform(chunk, encoding, callback) {
        let data = chunk.toString();
        if (this._lastLineData) data = this._lastLineData + data;

        const lines = data.split('\n');
        this._lastLineData = lines.pop();
        lines.forEach(line => this.push(line));
        callback();
    }

    _flush(callback) {
        if (this._lastLineData) this.push(this._lastLineData);
        this._lastLineData = null;
        callback();
    }
}

module.exports = LineSplitStream;
