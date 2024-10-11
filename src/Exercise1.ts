/*
  HELLO WORLD

  This exercise honours the glorious tradition of the 'hello world' program presenting the VeChain Data Model
  to show how the data model helps to create objects and how to cast object between different types.

  JS represents strings according the [Unicode UTF-8](https://en.wikipedia.org/wiki/UTF-8) standard.
  For not-Latin alphabets and when combining glyphs there are more ways to show the same sign combining different
  sequences of bytes. This become relevant writing a content in languages using ideograms because those can be
  represented as single Unicode codepoint or as a sequence of Unicode codepoints combining the radical of the ideogram
  with additional glyph components.

  When string content is argument of encryption and signing, what is processed is the content represented as
  an array of bytes, but UTF-8 allows alternative representation of the same content as different arrays of bytes.
  Since the arrays are different, for the same content, different and incompatible encryption and signatures are
  possible if the JS runtime doesn't use the same encoding normalization algorithm.

  This exercise introduces the `Txt` class to represent content as a string, assuring it representation as byte array
  is consistent across JS runtimes, then it introduces the `Hex` class to get or parse a hexadecimal expression.

  The exercise shows how to create objects of the types provided by the VeChain Data model and how to cast
  them from one type to a different one.
 */

// STEP 1: import the `Hex` and `Txt` classes from the VeChain SDK core module.
// import { Hex, Txt } from "@vechain/sdk-core";

// "χαίρε κόσμε", read as "kaire cosme", means "hello world" in classic Greek.
const canonical = '\u03c7\u03b1\u03af\u03c1\u03b5\u0020\u03ba\u03cc\u03c3\u03bc\u03b5';
const diacritic = '\u03c7\u03b1\u03B9\u0301\u03c1\u03b5\u0020\u03ba\u03bf\u0301\u03c3\u03bc\u03b5';

// Get the hexadecimal representation of `canonical` and `diacritic` strings.
const hexFromCanonical = strToHex(canonical);
const hexFromDiacritic = strToHex(diacritic);

// The canonical and diacritic result in the same string.
console.log(`${canonical} => ${hexFromCanonical}`);
console.log(`${diacritic} => ${hexFromDiacritic}`);

// STEP 2: wrap `canonical `and `diacritic` strings in object of `Txt` class.
/*
  For all the classes of the VeChain Data Model,
  the method `<class>.of(exp)`  builds a new object of the named class made of the `exp`(ressed) argument.

  The `Txt` class extends string, it can be used where strings are used.
  It differs from JS `string` type because its has a canonical representation as `Uint8Array` content.
 */

// const txtFromCanonical = Txt.of(canonical);
// const txtFromDiacritic = Txt.of(diacritic);

// STEP 3: Use `Hex` to represent the content of the `Txt` objects as hexadecimal expression.
/*
  The VeChain SDK core module is designed to use strictly the base types common to all the JS runtimes.
  These types are `bigint`, `number`, `string` and `Uint8Array`.

  All the classes of the VeChain Data Model implement the `VeChainDataModel` interface,
  the interface provides properties to cast the object to a canonical representation of the wished type:
  - `.bytes` returns the object encoded as an `Uint8Array`;
  - `.bi` returns the object value as a `bigint`, or it throws an exception if the cast is not possible;
  - `.n` returns the object value as a `number`, or it throws an exception if the cast is not possible;
  - `.toString()` returns the object encoded as a string.

  To get the hexadecimal representation of an object of any VeChain Data Model class, combine the
  `of` method with the `.bytes` property, for example if `obj` is the object
  ```
  Hex.of(obj.bytes)
  ```
  is its hexadecimal representation.
 */

// const hexFromTxtCanonical = Hex.of(txtFromCanonical.bytes);
// const hexFromTxtDiacritic = Hex.of(txtFromDiacritic.bytes);

// STEP 4: print the `Txt` objects and their hexadecimal representation.
// The content of the strings is the same, their hexadecimal representation is the same
// because its content as array of bytes is the same.

// console.log(`${txtFromCanonical} => ${hexFromTxtCanonical}`);
// console.log(`${txtFromDiacritic} => ${hexFromTxtDiacritic}`);


// STEP 5: Show from the array of bytes, one gets the same string.
/*
  Either `txtFromCanonical` or `txtFromDiacritic` can be used for this purpose,
  albeit built from different strings, they encode the content to the same array of bytes,
  hence it is sufficient to wrap the `.bytes` property
  - using `Hex.of` to create a new object representing the content as a hexadecimal expression,
  - using `Txt.of` to create a new object representing the content as a string, this will show "χαίρε κόσμε".
 */

// console.log(`${Hex.of(txtFromDiacritic.bytes)} => ${Txt.of(txtFromDiacritic.bytes)}`);

/**
 * Converts a given string to its hexadecimal representation.
 *
 * @param {string} str - The string to be converted to hexadecimal.
 * @return {string} The hexadecimal representation of the input string.
 */
function strToHex(str: string): string {
  return '0x' + str.split('').map((char) => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
}
