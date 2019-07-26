'use strict';

const sequenceTypes = new Set([ 'ListExpression', 'MemberExpression' ]);

function ListExpression(node, stack) {
    const cursor = stack[stack.length - 1];
    cursor.value.push(node);

    if (sequenceTypes.has(node.type)) {
        stack.push(node);
    }
}

function MemberExpression(node, stack) {
    const cursor = stack[stack.length - 1];
    cursor.value.push(node);

    if (sequenceTypes.has(node.type)) {
        stack.push(node);
    }
}

function Tag(node, stack) {
    const cursor = stack[stack.length - 1];
    cursor.value = node;
    stack.pop();
    if (sequenceTypes.has(node.type)) {
        stack.push(node);
    }
}

module.exports = {
    ListExpression,
    MemberExpression,
    Tag
};
