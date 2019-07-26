'use strict';

const nil = void 0;
const EmitOrNil = emitter => v => v != nil ? emitter(v) : v;

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

function GenSym({ node, emitter, readers, GenerateName }) {
    return GenerateName(node.value);
}

function Tag({ node, emitter, readers, GenerateName }) {
    return readers[node.tag](emitter(node.value), { GenerateName });
}

module.exports = {
    ListExpression,
    MemberExpression,
    Literal,
    Tag,
    GenSym
};
