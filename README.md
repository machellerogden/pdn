# PDN

> POSIX-friendly Data Notation [pee-dee-en]

Herein you will find the data format specification for PDN. You will also find here a Node.js reader implementation which can be used as the canonical reference for further implementations.

# Design Goals

PDN aims to be:

* a simple data notation for stating well-structured data in command-line arguments
* a robust data notation that is a superset of JSON
* a streamable data notation which does not require an enclosing element at the top-level
* an extendable data notation which allows for macro dispatch via tagged elements

# Rationale

Manual data entry from the command-line using most popular data specifications requires use of strong quotes (`'`) to avoid interpretation of reserved shell characters.

Additionally, manually entering complex data is cumbersome. So much so, in fact, that most command-line interfaces (CLIs) opt to add flags for every command option instead of requiring the user to specify options as well-structure data.

If stating well-structure from the command-line were made easier, perhaps more CLIs would opt for a more data-oriented interface.

PDN offers a format specification and reader implementation which seeks to provide a possible path forward.

# Spec

PDN is in part inspired by EDN and as such, much of the PDN specification which follows was lifted directly from the [edn](https://github.com/edn-format/edn) README. Like edn, the specification is casual. Unlike edn, a formal BNF will likely never be provided.

## General considerations

PDN elements, streams and files should be encoded using UTF-8.

Elements are generally separated by whitespace. Whitespace, other than within strings, is not otherwise significant, nor need redundant whitespace be preserved during transmissions. Commas , are also considered whitespace, other than within strings.

The delimiters { } ( ) [ ] need not be separated from adjacent elements by whitespace.

### @ dispatch character

Tokens beginning with @ are reserved. The character following @ determines the behavior. The dispatch for @alphabetic-char (tag) is defined below. @ is not a delimiter.

## Built-in elements

#### `nil` and `null`

Both `nil` and `null` represent nil, null or nothing. The elements should be read as an object with similar meaning on the target platform.

#### booleans

`true` and `false` should be mapped to booleans.

If a platform has canonic values for true and false, it is a further semantic of booleans that all instances of true yield that (identical) value, and similarly for false.

#### strings

Strings are enclosed in either "double quotes" or 'single quotes'. May span multiple lines. Escape characters `\t`, `\r`, `\n`, `\\`, `\"` and `\'` are supported.

> Note: The reference implementation contained in this repository only supports the `\"` and `\'` escape characters.

#### characters

There is no support for characters separate from that of strings.

#### symbols

Symbols are used to represent identifiers, and should map to something other than strings, if possible.

Symbols begin with a non-numeric character and can contain alphanumeric characters and . * + ! - _ ? $ % & = < >. If -, + or . are the first character, the second character (if any) must be non-numeric. Additionally, `:` `@` are allowed as constituent characters in symbols other than as the first character.

If a symbol ends with `^` then it will be appended with a suffix which ensures it has a unique name. The suffix is of the format `-{n}` where `n` is an integer which increments as other symbols of the same name are generated.

> Note: The reference implementation contained in this repository will represent symbols as javascript or JSON string values. Additionally, the current implementation does not yet support all of the characters indicated in the above specification.

#### keywords

There is currently no specification for a special keyword or enumeration value separate from strings or symbols.

#### integers

Integers consist of the digits 0 - 9, optionally prefixed by - to indicate a negative number, or (redundantly) by +. No integer other than 0 may begin with 0. -0 is a valid integer not distinct from 0.

#### floating point numbers

Floating point numbers should be supported.

#### arrays

An array is a sequence of values that supports random access. Arrays are represented by zero or more elements enclosed in square brackets `[]` or in parentheses `()`.

```
[a b 42]
(a b 42)
```

#### objects

A map is a collection of associations between keys and values. Maps are represented by zero or more key and value pairs enclosed in curly braces `{}` or with a special notation using square brackets or parenthese wherein the open element of the balance group is immediatedly followed by a colon `:`. Each key should appear at most once. No semantics should be associated with the order in which the pairs appear.

```
{a 1, "foo" bar, [1 2 3] four}
[:a 1, "foo" bar, [1 2 3] four]
(:a 1, "foo" bar, [1 2 3] four)
```

Note that keys and values can be elements of any type. The use of commas above is optional, as they are parsed as whitespace.

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

`@obj`

##### comments

If a `^` character is encountered outside of a string, that character and all subsequent characters to the next newline should be ignored.

## Reference Implementation

TODO
