const { Readable } = require("stream");
const createStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

module.exports = { createStream };
