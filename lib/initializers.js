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

module.exports = {
    bracket: {
        '[': ListExpression
    },
    name: Literal,
    keyword: Literal,
    key: Literal,
    string: Literal,
    number: Literal
};
