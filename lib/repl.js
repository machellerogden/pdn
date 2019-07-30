'use strict';
const { EOL } = require('os');
const { pipe } = require('./util');
const { readAll } = require('./reader');
const { inspect } = require('util');

const pprint = v => inspect(v, { depth: null, colors: true });

module.exports = {
    start() {
        return require('repl').start({
            eval: (cmd, context, filename, callback) => readAll(cmd).then(value => callback(null, value)),
            writer: output => output.map(pprint).join(EOL)
        });
    }
};
