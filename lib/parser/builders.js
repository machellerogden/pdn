'use strict';

const descentTypes = new Set([ 'ListExpression', 'MemberExpression', 'Tag' ]);

function ListExpression(node, stack) {
    const cursor = stack[stack.length - 1];
    cursor.value.push(node);

    if (descentTypes.has(node.type)) {
        stack.push(node);
    }
}

function MemberExpression(node, stack) {
    const cursor = stack[stack.length - 1];
    cursor.value.push(node);

    if (descentTypes.has(node.type)) {
        stack.push(node);
    }
}

function Tag(node, stack) {
    const cursor = stack[stack.length - 1];
    cursor.value = node;
    stack.pop();
    if (descentTypes.has(node.type)) {
        stack.push(node);
    }
}

module.exports = {
    ListExpression,
    MemberExpression,
    Tag
};
