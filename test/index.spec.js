'use strict';

import test from 'ava';
import { read } from '..';

test('works', async t => {
    const input = `
foo
123
123.456
+0
-0
[foo,123,-10.00,true,false,nil,foo^,foo^]
[:foo 123
  bar -10.00
  baz true
  qux[a,b, [c,d,e]]]
[:foo 123
  bar -10.00
  baz true
  qux[a,b, @join [c,d,e]]]
`;
    const expected = [
        'foo',
        123,
        +123.456,
        0,
        0,
        [ 'foo', 123, -10.00, true, false, null, 'foo-1', 'foo-2' ],
        { foo: 123, bar: -10.00, baz: true, qux: [ 'a', 'b', [ 'c', 'd', 'e' ] ] },
        { foo: 123, bar: -10.00, baz: true, qux: [ 'a', 'b', 'c-d-e' ] }
    ];
    t.plan(expected.length);
    let i = 0;
    const readers = {
        join: el => el.join('-')
    };
    for await (const result of read(input, { readers })) {
        t.deepEqual(result, expected[i++]);
    }
});
