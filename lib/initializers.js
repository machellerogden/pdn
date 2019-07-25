'use strict';

function ListExpression() {
    return {
        type: 'ListExpression',
        elements: []
    };
}

function Literal(value) {
    return {
        type: 'Literal',
        value
    };
}

function Tag(tag) {
    return {
        type: 'Tag',
        tag,
        element: null
    };
}

module.exports = {
    bracket: {
        '[': ListExpression
    },
    brace: {
        '{': ListExpression
    },
    paren: {
        '(': ListExpression
    },
    name: Literal,
    tag: Tag,
    key: Literal,
    string: Literal,
    number: Literal
};
