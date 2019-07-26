'use strict';

const emitters = require('./emitters');
const builtInReaders = require('./readers');

function Emitter({ readers:customReaders = {} } = {}) {
    const readers = { ...builtInReaders, ...customReaders };
    async function* emit(results) {
        for await (const ast of results) {
            if (ast == null) continue;

            function emitter(node) {
                if (emitters[node.type] == null) throw SyntaxError(node.type);
                return emitters[node.type](node, emitter, readers);
            }

            yield emitter(ast);
        }
    }
    return { emit };
}

module.exports = { Emitter };
