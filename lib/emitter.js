'use strict';

module.exports = { Emitter };

const nil = void 0;
const EmitOrNil = emitter => v => v != nil ? emitter(v) : v;

const emitters = {
    ListExpression,
    MemberExpression,
    Literal,
    Tag
};

function ListExpression(node, emitter) {
    return node.value.map(emitter);
}

function MemberExpression(node, emitter) {
    const emit = EmitOrNil(emitter);
    return node.value.reduce((acc, v, i, col) => {
        let k;
        [ k, v ] = i % 2
            ? [ col[i - 1], v ]
            : [ v ];
        acc[emit(k)] = emit(v);
        return acc;
    }, {});
}

function Literal(node) {
    return node.value;
}

function Tag(node, emitter, readers) {
    return readers[node.tag](emitter(node.value));
}

function Emitter({ readers = {} } = {}) {
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
