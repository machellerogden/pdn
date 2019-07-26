'use strict';

const emitters = require('./emitters');
const builtInReaders = require('./readers');
const { createNameFactory } = require('./name');

function Emitter({ readers:customReaders = {} } = {}) {
    const readers = { ...builtInReaders, ...customReaders };
    const GenerateName = createNameFactory();
    async function* emit(results) {
        for await (const ast of results) {
            if (ast == null) continue;

            function emitter(node) {
                if (emitters[node.type] == null) throw SyntaxError(node.type);
                return emitters[node.type]({ node, emitter, readers, GenerateName });
            }

            yield emitter(ast);
        }
    }
    return { emit };
}

module.exports = { Emitter };
