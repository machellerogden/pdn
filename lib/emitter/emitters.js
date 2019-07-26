'use strict';

const nil = void 0;
const EmitOrNil = emitter => v => v != nil ? emitter(v) : v;

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

module.exports = {
    ListExpression,
    MemberExpression,
    Literal,
    Tag
};
