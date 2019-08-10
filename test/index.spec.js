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
[:foo: 123
  bar -10.00
  'baz':true
  qux[a,b, [c,d,e]]]
[:foo 123
  bar :-10.00
  baz : true
  "qux":[a,b, @join [c,d,e]]]
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

test('json', async t => {
    const input = `{"2":true,"2eLa51987":5209,"Hbyn":"jt4eQ6z34KOhlAaaBy","IH395a453aqV3vp4n9kWR9nzMS":-45,"1yR7E6FCzKsHF":116349,"L6X72qaq43fe2P8MPnaOTjx":"G4HHL","47l614742JU289P2cSKoT2lz77L":-903089785.000234,"R1i5aB14z6kljN":true,"g51ju":true,"Yq1JyKWK459HK2":"3qN81QYMuXdrNUszO5STkT","Kk9TnebSKViPfT2KBLPs8Qit3m":true,"2m9hrV4ucd3Czkp7eyKad6A":"mWV42h9k97Q997gmUMaJ5kB9","eqD51J372v3QVI":"6GvCDj1Pq347DaqB6","qhuD21HR27FoBcl3c6i9Tzc37f1":true}
{'M61l93S8wC8"rMufUWIMK':"5o7g2C93tu5PgP","FlY11bVrhgeVIT2aS2P37NAvUC5fK8":null}
{"x88l4xMZ":"czFfU9tlm7R2cZ","EHlYzef8l4eJ":{"QL4APek5t74SXwIIZK":"vYMp3rHeY5a9Z2s3jg","lMzjvo4vnM4GSeHT9Qoq6ejAyNDzB9":49414510,"l2tUw9LtBiOjh8Ow":6421880488980,"Z77DMnL82":false,"z458M2a5q51uFiol54y38MZQvA88JLz":"StHwqPa9zO2","7XK1zwCoY8al7":-80377,"Y4Haf":72182456,"f46PXgnp9B6I8BTUZ":true,"F1zVlDU8BF3PhJDHyqFjZBTc":false,"ES9S31JFZtqQ1ME6429D9qrn4pgp6":"Z96mLpB8Sz1D5GS","2IP766642G38vUMl63a4igH3lCEG3e8o":"67HA1S"}}`;
    const expected = [
        {
            '2': true,
            '2eLa51987': 5209,
            Hbyn: 'jt4eQ6z34KOhlAaaBy',
            IH395a453aqV3vp4n9kWR9nzMS: -45,
            '1yR7E6FCzKsHF': 116349,
            L6X72qaq43fe2P8MPnaOTjx: 'G4HHL',
            '47l614742JU289P2cSKoT2lz77L': -903089785.000234,
            R1i5aB14z6kljN: true,
            g51ju: true,
            Yq1JyKWK459HK2: '3qN81QYMuXdrNUszO5STkT',
            Kk9TnebSKViPfT2KBLPs8Qit3m: true,
            '2m9hrV4ucd3Czkp7eyKad6A': 'mWV42h9k97Q997gmUMaJ5kB9',
            eqD51J372v3QVI: '6GvCDj1Pq347DaqB6',
            qhuD21HR27FoBcl3c6i9Tzc37f1: true
        },
        {
            'M61l93S8wC8"rMufUWIMK': '5o7g2C93tu5PgP',
            FlY11bVrhgeVIT2aS2P37NAvUC5fK8: null
        },
        {
            x88l4xMZ: 'czFfU9tlm7R2cZ',
            EHlYzef8l4eJ: {
                QL4APek5t74SXwIIZK: 'vYMp3rHeY5a9Z2s3jg',
                lMzjvo4vnM4GSeHT9Qoq6ejAyNDzB9: 49414510,
                l2tUw9LtBiOjh8Ow: 6421880488980,
                Z77DMnL82: false,
                z458M2a5q51uFiol54y38MZQvA88JLz: 'StHwqPa9zO2',
                '7XK1zwCoY8al7': -80377,
                Y4Haf: 72182456,
                f46PXgnp9B6I8BTUZ: true,
                F1zVlDU8BF3PhJDHyqFjZBTc: false,
                ES9S31JFZtqQ1ME6429D9qrn4pgp6: 'Z96mLpB8Sz1D5GS',
                '2IP766642G38vUMl63a4igH3lCEG3e8o': '67HA1S'
            }
        }
    ];
    t.plan(expected.length);
    let i = 0;
    for await (const result of read(input)) {
        t.deepEqual(result, expected[i++]);
    }
});

test('unquoted strings', async t => {
    const input = `
yor%'-<__d
sii<_=<&-s
ens.=-:%>_s
pni_.%.$=e
iaa+=%>@%+t
gra'_<>%.s
doi<$>'%-%'<'-*f
bis'_$%!%+<-__'e
esi%:+&-'<<>-_?!s
oin_<es-&-_+%_'e
yoen&^?%.<.&_-=e
wor''$<&=$--->.s
cten=---<tis=_?t
hta+_!=th%^':-*-e
gai.<_%-'*=*$&%t
ats-<'%-=-__-ren
uis'=-'-&>*&+>=e
kaes%*'&%-<.'%*t
`;

    const expected = [
        "yor%'-<__d",
        'sii<_=<&-s',
        'ens.=-:%>_s',
        'pni_.%.$=e',
        'iaa+=%>@%+t',
        "gra'_<>%.s",
        "doi<$>'%-%'<'-*f",
        "bis'_$%!%+<-__'e",
        "esi%:+&-'<<>-_?!s",
        "oin_<es-&-_+%_'e",
        'yoen&^?%.<.&_-=e',
        "wor''$<&=$--->.s",
        'cten=---<tis=_?t',
        "hta+_!=th%^':-*-e",
        "gai.<_%-'*=*$&%t",
        "ats-<'%-=-__-ren",
        "uis'=-'-&>*&+>=e",
        "kaes%*'&%-<.'%*t"
    ];
    t.plan(expected.length);
    let i = 0;
    for await (const result of read(input)) {
        t.deepEqual(result, expected[i++]);
    }
});
