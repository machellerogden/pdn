# PDN

> Pragmatic Data Notation

Herein you will find the data format specification for PDN. You will also find here a Node.js reader implementation which can be used as the canonical reference for further implementations.

# Design Goals

First and foremost, PDN is intended to provide a simple notation for stating well-structured data within restrictive interpreters such as a command-line interface.

Additionally, PDN aims to be:

* a robust data notation that is a superset of JSON
* a streamable data notation which does not require an enclosing element at the top-level
* an extendable data notation which allows for macro dispatch via tagged elements

Note: PDN is NOT a superset of edn and does not intend to compete with edn. If you need edn, use edn.

# Rationale

Most command-line interfaces (CLIs) implement support for a set of flag (i.e. `-f`) and option (i.e. `--env`) arguments in order to gather basic data from the user. For more complex input, data files sources are often leveraged. This approach is fine for the vast majority of use cases but there exists a subset of command-line use-cases wherein it is desirable for the user to be able to state well-structured directly within command-line arguments. Many CLIs for interfacing with complex systems end up providing a set of "advanced" options the value of which is directly stated data in a common notation, such as JSON. Typing JSON from a command-line is tedious and error-prone.

Manual data entry from the command-line using most popular data notations requires use of strong quotes (`'`) to avoid interpretation of reserved shell characters. Futhermore, entering data at the command-line using most popular data notations, such as JSON, can be tedious and error-prone.

PDN seeks to provide an alternative notation which makes manual entry easier and which can easily be extended by implementors in order to further streamline the data entry experience.

If stating well-structured data from the command-line were made easier, perhaps more CLIs would opt for a more data-oriented interface.

# Spec

PDN is in part inspired by edn and as such, much of the PDN specification which follows was lifted directly from the [edn](https://github.com/edn-format/edn) README. Like edn, the specification is casual. Unlike edn, a formal BNF will likely never be provided.

## General considerations

PDN elements, streams and files should be encoded using UTF-8.

Elements are generally separated by whitespace. Whitespace, other than within strings, is not otherwise significant, nor need redundant whitespace be preserved during transmissions. Commas `,` are also considered whitespace, other than within strings. Colons `:` are also considered whitespace unless immediately proceeding an opening bracket `[` or opening parenthese `(`.

The delimiters `{` `}` `(` `)` `[` `]` need not be separated from adjacent elements by whitespace.

### @ dispatch character

Tokens beginning with `@` are reserved. The character following `@` determines the behavior. The dispatch for @alphabetic-char (tag) is defined below. `@` is not a delimiter.

## Built-in elements

#### `nil` and `null`

Both `nil` and `null` represent nil, null or nothing. The elements should be read as an object with similar meaning on the target platform.

#### booleans

`true` and `false` should be mapped to booleans.

If a platform has canonic values for true and false, it is a further semantic of booleans that all instances of true yield that (identical) value, and similarly for false.

#### strings

Strings are enclosed in either "double quotes" or 'single quotes'. May span multiple lines. Escape characters `\t`, `\r`, `\n`, `\\`, `\"` and `\'` are supported.

> Note: The reference implementation contained in this repository currently only supports the `\"` and `\'` escape characters.

#### characters

There is no support for characters separate from that of strings.

#### symbols

Unlike edn, PDN does not have full support for symbols. In PDN, symbols map to strings. Symbols in PDN simply offer a more terse way to express a string value when the character set of the string is such that it does not require quoting.

Symbols begin with an alphabetic character. Allowed characters after the first character are: `.` `*` `+` `!` `-` `_` `?` `$` `%` `&` `=` `<` `>` `@`.

If a symbol ends with `^` then it will be appended with a suffix which ensures it has a unique name. This is similar to the gensym behaviour of clojure macros (which instead use the `#` suffix). The generated suffix is of the format `-{n}` where `n` is an integer which increments as other symbols of the same name are generated.

#### keywords

Unlike edn, PDN does not currently specify a special keyword or enumeration value separate from strings or symbols.

#### integers

Integers consist of the digits 0 - 9, optionally prefixed by - to indicate a negative number, or (redundantly) by +. No integer other than 0 may begin with 0. -0 is a valid integer not distinct from 0.

#### floating point numbers

Floating point numbers are supported.

#### arrays

An array is a sequence of values that supports random access. Arrays are represented by zero or more elements enclosed in square brackets `[]` or in parentheses `()`.

```
[a b 42]
(a b 42)
```

#### objects

An object is a collection of associations between keys and values. Object are represented by zero or more key and value pairs enclosed in curly braces `{}` or with a special notation using square brackets or parenthese wherein the opening element of the balance group is immediatedly followed by a colon `:`. Each key should appear at most once. No semantics should be associated with the order in which the pairs appear.

```
{a:1,foo:bar}
[:a:1,foo:bar]
(:a:1,foo:bar)
```

Note that if keys are not stated as strings, the reader should attempt to coerced the value to a string representation. The use of commas and colons above is optional, as they are parsed as whitespace.

#### tagged elements

PDN supports extensibility through a simple mechanism. `@` followed immediately by a symbol starting with an alphabetic character indicates that that symbol is a tag. A tag indicates the semantic interpretation of the following element. It is envisioned that a reader implementation will allow clients to register handlers for specific tags. Upon encountering a tag, the reader will first read the next element (which may itself be or comprise other tagged elements), then pass the result to the corresponding handler for further interpretation, and the result of the handler will be the data value yielded by the tag + tagged element, i.e. reading a tag and tagged element yields one value. This value is the value to be returned to the program and is not further interpreted as PDN data by the reader.

This process will bottom out on elements either understood or built-in.

Thus you can build new distinct readable elements out of (and only out of) other readable elements, keeping extenders and extension consumers out of the text business.

The semantics of a tag, and the type and interpretation of the tagged element are defined by the steward of the tag.

`@mytag {:first "Fred" :last "Mertz"}`

If a reader encounters a tag for which no handler is registered, the implementation can either report an error, call a designated 'unknown element' handler, or create a well-known generic representation that contains both the tag and the tagged element, as it sees fit. Note that the non-error strategies allow for readers which are capable of reading any and all PDN, in spite of being unaware of the details of any extensions present.

##### rules for tags

Tags themselves are not elements. It is an error to have a tag without a corresponding tagged element.

##### built-in tagged elements

##### @obj

`@obj` before any sequence will transform that sequence into an object representation.

##### comments

If a `#` character is encountered outside of a string or symbol, that character and all subsequent characters to the next newline should be ignored.

## Reference Implementation

Contained in this repository is a robust reference implementation.

### Requirements

* Node.js v12+

_Note: Node.js v10+ will work but will emit ExperimentalWarning due to how the stream implementation has been written using features which are only officially supported in Node.js v12+._

### Global Install

```
npm i -g pdn
```

### Local Install (as a project dependency)

```
npm i pdn
```

### Command-Line Usage

#### Read to JSON from command-line arguments

```sh
> pdn foo 123
"foo"
123
> pdn [foo,123]
["foo" 123]
> pdn [:foo,123]
{"foo":123}
> pdn [foo^,foo^[:foo^,foo^]]
["foo-1","foo-2",{"foo-3":"foo-4"}]
```

#### Read to JSON from stdin

```sh
> echo foo 123 | pdn 
"foo"
123
> echo [foo,123] | pdn
["foo" 123]
> echo [:foo,123] | pdn
{"foo":123}
> echo [foo^,foo^[:foo^,foo^]] | pdn
["foo-1","foo-2",{"foo-3":"foo-4"}]
```

#### Read to JSON in REPL

```sh
> pdn
> foo 123
"foo"
123
> [foo,123]
["foo" 123]
> [:foo,123]
{"foo":123}
> [foo^,foo^[:foo^,foo^]]
["foo-1","foo-2",{"foo-3":"foo-4"}]
```

# API

<a name="read"></a>

## read(input, [options]) ⇒ <code>AsyncIterator</code>
Accepts a ReadableStream, an AsyncIterator, an array or a string and returns an AsyncIterator.

**Kind**: global function  
**Returns**: <code>AsyncIterator</code> - Returns an AsyncIterator which yields Promises which resolve to parsed data.  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>ReadableStream</code> \| <code>AsyncIterator</code> \| <code>Array</code> \| <code>string</code> | Raw input data |
| [options] | <code>Object</code> | Optional options object. Currently only used for specifying custom readers for tag dipatch. |

**Example**  
```js
for await (const result of read('[:foo:123,bar:true,baz:nil]')) {
    console.log(result);
}
// => { foo: 123, bar: true, baz: null }

for await (const result of read('@join [foo bar baz]', { readers: { join: el => el.join('-') } })) {
    console.log(result);
}
// => foo-bar-baz
```
<a name="readToStream"></a>

## readToStream(input, [options]) ⇒ <code>WritableStream</code>
Accepts a ReadableStream, an array or a string and returns a WritableStream. Stream output will be utf-8 text. Stream values will be delimited by a system-native newline escape character.

**Kind**: global function  
**Returns**: <code>WritableStream</code> - Returns a WritableStream Stream output will be utf-8 text. Stream values will be delimited by a system-native newline escape character.  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>ReadableStream</code> \| <code>AsyncIterator</code> \| <code>Array</code> \| <code>string</code> | Raw input data |
| [options] | <code>Object</code> | Optional options object. Currently only used for specifying custom readers for tag dipatch. |

**Example**  
```js
readToStream('[:foo:123,bar:true,baz:nil]').pipe(process.stdout);
// => "{\"foo\":123,\"bar\":true,\"baz\":null}"
```
<a name="readOne"></a>

## readOne(input, [options]) ⇒ <code>Promise</code>
Accepts a ReadableStream, an AsyncIterator, an array or a string and returns a Promise which resolves to the first value of the stream.

**Kind**: global function  
**Returns**: <code>Promise</code> - Returns a Promise which resolves to the first value of the stream.  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>ReadableStream</code> \| <code>AsyncIterator</code> \| <code>Array</code> \| <code>string</code> | Raw input data |
| [options] | <code>Object</code> | Optional options object. Currently only used for specifying custom readers for tag dipatch. |

**Example**  
```js
console.log(await readOne('[:foo:123,bar:true,baz:nil]'));
// => { foo: 123, bar: true, baz: null }
```
<a name="readAll"></a>

## readAll(input, [options]) ⇒ <code>Promise</code>
Accepts a ReadableStream, an AsyncIterator, an array or a string and returns a Promise which resolves to an array of all values.

Note: If a stream or iterator is passed to `readAll` and it does not complete, the Promise returned by this function will never resolve.

**Kind**: global function  
**Returns**: <code>Promise</code> - Returns a Promise which resolves to an array of all values.  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>ReadableStream</code> \| <code>AsyncIterator</code> \| <code>Array</code> \| <code>string</code> | Raw input data |
| [options] | <code>Object</code> | Optional options object. Currently only used for specifying custom readers for tag dipatch. |

**Example**  
```js
console.log(await readAll('[:foo:123,bar:true,baz:nil]'));
// => [ { foo: 123, bar: true, baz: null } ]
```
# License

MIT
