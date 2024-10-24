// START-SNIPPET: FinancialMath_1
// STEP 1: import FixedPointNumber and BigNumber to compare results among the two libraries.
import {FixedPointNumber} from '@vechain/sdk-core';
import {BigNumber} from 'bignumber.js';

// STEP 2: create two equivalent objects from different expression types and check they are equivalent.
let x = FixedPointNumber.of(123.456789);
let y = FixedPointNumber.of('123.456789');
console.log(`FPN value ${x} from number is ${x.isEqual(y) ? '' : 'not'}equal to ${y} from string.`);

// STEP 3: cast to a number
console.log(`Cast FPN value to number is ${x.n}.`);

// STEP 4: cast a rational value to a bigint type truncates the value to integer.
console.log(`Cast FPN value to bigint is ${x.bi}.`);

// END-SNIPPET: FinancialMath_1

// START-SNIPPET: FinancialMath_2
// STEP 5: compute 1/3 comparing JS number, BigNumber and SDK FixedPointNumber math
x = FixedPointNumber.of(1);
y = FixedPointNumber.of(3);
let r = x.div(y);   // r for 'ratio'.
console.log(`${x}/${y} => JS = ${x.n / y.n};\tBigNumber = ${BigNumber(x.n).div(y.n)};\tSDK = ${r}`);

// END-SNIPPET: FinancialMath_2

// START-SNIPPET: FinancialMath_3
// STEP 6: increase the precision to 80 decimal digits.
let fd = 80;            // Fractional Digits.
x = x.dp(80);                   // Force x to fd precision, .div function will adapt y automatically
r = x.div(y);                   // Ratio
let a = BigNumber(x.n).dp(fd);  // Force to fd precision.
let b = BigNumber(y.n).dp(fd);  // Force to fd precision
let q = a.div(b)                // q for 'quotient' synonymous of 'ratio'.
console.log(`${x}/${y} => BigNumber ${q};\t SDK = ${r}`);

// END-SNIPPET: FinancialMath_3

// START-SNIPPET: FinancialMath_3
// STEP 7: compute the squared root of the natural number from 0 to n.
fd = 20;
let n = 8
let rows = [];
for (let i = 0; i <= n; i++) {
    x = FixedPointNumber.of(i).dp(fd).sqrt();
    a = BigNumber(i).dp(fd).sqrt();
    rows.push({
        'JS number': Math.sqrt(i),
        'BigNumber': `${a}`,
        'SDK FixedPointNumber': `${x}`
    })
}
console.table(rows);

// END-SNIPPET: FinancialMath_3

// START-SNIPPET: FinancialMath_4
// STEP 8: compute the squared root of the natural number from 0 to n.
fd = 80;
n = 8
rows = [];
for (let i = 0; i <= n; i++) {
    x = FixedPointNumber.of(i).dp(fd).sqrt();
    a = BigNumber(i).dp(fd).sqrt();
    rows.push({
        'JS number': Math.sqrt(i),
        'BigNumber': `${a}`,
        'SDK FixedPointNumber': `${x}`
    })
}
console.table(rows);

// END-SNIPPET: FinancialMath_4

// START-SNIPPET: FinancialMath_5
// STEP 9: compute the divisions by zero, infinity and between zeros.
r = x.div(FixedPointNumber.ZERO);
console.log(`${x}/0 = ${r}`);
r = x.div(FixedPointNumber.of(Infinity));
console.log(`${x}/infinity = ${r}`);
r = x.div(FixedPointNumber.ZERO.div(FixedPointNumber.ZERO));
console.log(`0/0 = ${r}`);

// END-SNIPPET: FinancialMath_5
