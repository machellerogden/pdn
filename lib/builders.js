'use strict';

function ListExpression(node, stack) {
    const cursor = stack[stack.length - 1];
    cursor.elements.push(node);

    if (node.type === 'ListExpression') {
        stack.push(node);
    }
}

module.exports = {
    ListExpression
};
