'use strict';

function* NameGenerator(key) {
    if (!key.length) key = 'sym';
    const counters = {};
    while (true) {
        yield `${key}-${counters[key]
            ? (counters[key] = counters[key] + 1)
            : (counters[key] = 1)}`;
    }
}

function createNameFactory() {
    const keys = {};
    return function NameFactory(key) {
        let iter = keys[key] = keys[key] || NameGenerator(key);
        return iter.next().value;
    };
}

module.exports = {
    createNameFactory
};
