'use strict';

const EmitOrNil = emitter => v => v != null ? emitter(v) : v;

function ListExpression({ node, emitter }) {
    return node.value.map(emitter);
}

function MemberExpression({ node, emitter }) {
    const emit = EmitOrNil(emitter);
    return node.value.reduce((acc, v, i, col) => {
        let k;
        if (i % 2) {
            [ k, v ] = [ col[i - 1], v ]
            acc[emit(k)] = emit(v);
        }
        return acc;
    }, {});
}

function Literal({ node }) {
    return node.value;
}

function GenSym({ node, emitter, readers, genSym }) {
    return genSym(node.value);
}

function Tag({ node, emitter, readers, genSym }) {
    return readers[node.tag](emitter(node.value), { genSym });
}

module.exports = {
    ListExpression,
    MemberExpression,
    Literal,
    Tag,
    GenSym
};
