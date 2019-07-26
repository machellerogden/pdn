'use strict';

module.exports = { emit };

async function* emit(results) {

    const emit = {
        ListExpression: (node, emitter) =>
            node.value.map(emitter),
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
