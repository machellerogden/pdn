'use strict';

function ListExpression() {
    return {
        type: 'ListExpression',
        value: []
    };
}

function MemberExpression() {
    return {
        type: 'MemberExpression',
        value: []
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
        value: null
    };
}

module.exports = {
    bracket: {
        '[': ListExpression
    },
    brace: {
        '{': MemberExpression
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
