'use strict';

function map(data) {
    return data.reduce((acc, v, i, col) => {
        let k;
        [ k, v ] = i % 2
            ? [ col[i - 1], v ]
            : [ v ];
        acc[k] = v;
        return acc;
    }, {});
}

module.exports = {
    map
};
