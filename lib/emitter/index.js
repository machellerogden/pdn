'use strict';

const emitters = require('./emitters');
const builtInReaders = require('./readers');
const { GenSym } = require('./name');

function Emitter({ readers:customReaders = {} } = {}) {

    const readers = { ...builtInReaders, ...customReaders };
    const genSym = GenSym();

    async function* emit(results) {
        for await (const ast of results) {
            if (ast == null) continue;

            function emitter(node) {
                if (emitters[node.type] == null) throw SyntaxError(node.type);
                return emitters[node.type]({ node, emitter, readers, genSym });
            }

            yield emitter(ast);
        }
    }

    return { emit };
}

module.exports = { Emitter };
