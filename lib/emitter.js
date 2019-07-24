'use strict';

module.exports = { emit };

async function* emit(results) {

    for await (const ast of results) {
        if (ast == null) continue;
        yield JSON.stringify(ast);
    }
}
