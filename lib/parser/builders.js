'use strict';

const sequenceTypes = new Set([ 'ListExpression' ]);

function ListExpression(node, stack) {
    const cursor = stack[stack.length - 1];
    cursor.value.push(node);

    if (sequenceTypes.has(node.type)) {
        stack.push(node);
    }
}

function Tag(node, stack) {
    const cursor = stack[stack.length - 1];
    cursor.element = node;
}

module.exports = {
    ListExpression,
    Tag
};
