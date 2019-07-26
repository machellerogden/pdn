'use strict';

module.exports = { emit };

const nil = null;
const EmitOrNil = emitter => v => v != nil ? emitter(v) : v;

async function* emit(results) {

    const emit = {
        ListExpression: (node, emitter) =>
            node.value.map(emitter),
        MemberExpression: (node, emitter) => {
            const emit = EmitOrNil(emitter);
            return node.value.reduce((acc, v, i, col) => {
                let k;
                [ k, v ] = i % 2
                    ? [ col[i - 1], v ]
                    : [ v ];
                acc[emit(k)] = emit(v);
                return acc;
            }, {});
        },
        Literal: node =>
            node.value
    };

    for await (const ast of results) {
        if (ast == null) continue;

        function emitter(node) {
            if (emit[node.type] == null) throw SyntaxError(node.type);
            return emit[node.type](node, emitter);
        }

        yield emitter(ast);
    }
}
