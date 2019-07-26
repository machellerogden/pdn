'use strict';

const { Compiler } = require('./compiler');
const { linebreak } = require('./util');

function Reader({ readers } = {}) {
    const { compile } = Compiler({ readers });
    function read(data) {
        const input = data[Symbol.asyncIterator]
            ? input
            : Array.isArray(data)
                ? data.values()
                : [ data ].values();
        return compile(linebreak(input));
    }
    return { read };
}

function read(data = '', { readers } = {}) {
    const { read } = Reader({ readers });
    return read(data);
}

module.exports = {
    Reader,
    read
};
