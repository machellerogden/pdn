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

function GenSym(value) {
    return {
        type: 'GenSym',
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
    sequence: {
        '[': ListExpression,
        '[:': MemberExpression,
        '{': MemberExpression,
        '{:': MemberExpression,
        '(': ListExpression,
        '(:': MemberExpression
    },
    name: Literal,
    gensym: GenSym,
    tag: Tag,
    string: Literal,
    number: Literal,
    bool: Literal,
    nil: Literal
};
