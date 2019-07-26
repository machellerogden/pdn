'use strict';

// NB, leftover from migration
// Will probably remove this file module eventually but might be useful if we want to bake-in GenSym

function* NameGenerator(key) {
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
        const next = () => iter.next().value;
        return { next };
    };
}

module.exports = {
    createNameFactory
};
