'use strict';

function ListExpression() {
    return {
        type: 'ListExpression',
        value: [],
        validate() {}
    };
}

function MemberExpression() {
    return {
        type: 'MemberExpression',
        value: [],
        validate() {
            if (this.value.length % 2 !== 0) {
                throw new SyntaxError('MemberExpression must contain an even number of forms');
            }
        }
    };
}

function Literal(value) {
    return {
        type: 'Literal',
        value,
        validate() {}
    };
}

function GenSym(value) {
    return {
        type: 'GenSym',
        value,
        validate() {}

    };
}

function Tag(tag) {
    return {
        type: 'Tag',
        tag,
        value: null,
        validate() {}

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
