// START_SNIPPET: HelloWorld_Step_1

// STEP 1: import the `Hex` and `Txt` classes from the VeChain SDK core module.
import { Hex, Txt } from "@vechain/sdk-core";

// "χαίρε κόσμε", read as "kaire cosme", means "hello world" in classic Greek.
const canonical = '\u03c7\u03b1\u03af\u03c1\u03b5\u0020\u03ba\u03cc\u03c3\u03bc\u03b5';
const diacritic = '\u03c7\u03b1\u03B9\u0301\u03c1\u03b5\u0020\u03ba\u03bf\u0301\u03c3\u03bc\u03b5';

// Get the hexadecimal representation of `canonical` and `diacritic` strings.
const hexFromCanonical = strToHex(canonical);
const hexFromDiacritic = strToHex(diacritic);

// The canonical and diacritic result in the same string.
console.log(`${canonical} => ${hexFromCanonical}`);
console.log(`${diacritic} => ${hexFromDiacritic}`);

// END_SNIPPET: HelloWorld_Step_1

// START_SNIPPET: HelloWorld_Step_2

// STEP 2: wrap `canonical `and `diacritic` strings in object of `Txt` class.

const txtFromCanonical = Txt.of(canonical);
const txtFromDiacritic = Txt.of(diacritic);

// END_SNIPPET: HelloWorld_Step_2

// START_SNIPPET: HelloWorld_Step_3

// STEP 3: Use `Hex` to represent the content of the `Txt` objects as hexadecimal expression.

const hexFromTxtCanonical = Hex.of(txtFromCanonical.bytes);
const hexFromTxtDiacritic = Hex.of(txtFromDiacritic.bytes);

// END_SNIPPET: HelloWorld_Step_3

// START_SNIPPET: HelloWorld_Step_4

// STEP 4: print the `Txt` objects and their hexadecimal representation.
// The content of the strings is the same, their hexadecimal representation is the same
// because its content as array of bytes is the same.

console.log(`${txtFromCanonical} => ${hexFromTxtCanonical}`);
console.log(`${txtFromDiacritic} => ${hexFromTxtDiacritic}`);

// END_SNIPPET: HelloWorld_Step_4

// START_SNIPPET: HelloWorld_Step_5

// STEP 5: Show from the array of bytes, one gets the same string.
console.log(`${Hex.of(txtFromDiacritic.bytes)} => ${Txt.of(txtFromDiacritic.bytes)}`);

// END_SNIPPET: HelloWorld_Step_5

// START_SNIPPET: HelloWorld_strToHex

/**
 * Converts a given string to its hexadecimal representation.
 *
 * @param {string} str - The string to be converted to hexadecimal.
 * @return {string} The hexadecimal representation of the input string.
 */
function strToHex(str: string): string {
    return '0x' + str.split('').map((char) => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
}

// END_SNIPPET: HelloWorld_strToHex
