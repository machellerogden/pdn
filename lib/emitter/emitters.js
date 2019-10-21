'use strict';

const EmitOrNil = emitter => v => v != null ? emitter(v) : v;

function ListExpression({ node, emitter }) {
    return Promise.all(node.value.map(emitter));
}

function MemberExpression({ node, emitter }) {
    const emit = EmitOrNil(emitter);
    return node.value.reduce(async (accp, v, i, col) => {
        const acc = await accp;
        let k;
        if (i % 2) {
            [ k, v ] = [ col[i - 1], v ]
            acc[emit(k)] = await emit(v);
        }
        return acc;
    }, Promise.resolve({}));
}

function Literal({ node }) {
    return node.value;
}

function GenSym({ node, emitter, readers, genSym }) {
    return genSym(node.value);
}

async function Tag({ node, emitter, readers, genSym }) {
    return readers[node.tag](await emitter(node.value), { genSym });
}

module.exports = {
    ListExpression,
    MemberExpression,
    Literal,
    Tag,
    GenSym
};
