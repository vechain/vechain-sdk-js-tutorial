## Lesson 1 - Part 2

# Financial Math

JavaScript (JS) was designed as front-end language, providing the simpler data type to cope with the need
of rendering, initially just the `string` type to express texts and `number` and `bigint` types to compute math.
JS was not designed to be strongly typed language, but the language was designed to delegate at runtime
the assessment of the type to represent any variable according its content.
When the success of JS as 'browser language' made it popular as a more general purpose language,
the need to pinpoint the data type of variable pushed the creation of TypeScript (TS)
as a language derived by and compatible with JS making explicit the type definition of variables,
and many libraries to provide specialized types to overcome the limits of JS.

## Number Type Limits

The JS `number` type implements the 64
bits [Double Precision Floating Point](https://en.wikipedia.org/wiki/Double-precision_floating-point_format)
representation as the `double` type common in *C#*, *Java?Kotlin* and *Rust/Zig* programming languages.
This representation uses 8 bytes to approximate the value as follows

- 1 bit to represent the value **sign**,
- 11 bits to represent an **exponent**, one bit for the exponent sign and 2<sup>10</sup> = 1024 as exponent value,
- 52 bits to represent an integer - named **significand** multiplied for the above **exponent** and **sign**,
  2<sup>52</sup> is roughly equal to 4500000000000000 (45 followed by fourteen zeros).

Any value can't be represented exactly as a product of the integers **significand** * **2<sup>exponent</sup>** * **sign
**
is approximated with less precision for values very big or very small fraction, positive or negative doesn't matter.

Actually, IEEE-754 represents precisely values in the range ±2.23×10<sup>−308</sup> to ±1.80×10<sup>308</sup> in 16
decimal digits comprehensive of the integer and fractional parts.

It's important to anticipate due to the finite quantity of computer memory and the binary nature of electronic logic,
computers can only represent values as polynomial expressions of powers of 2, hence any *rational** value not the result
of a ratio between two values power of two, like **1/3* returning "zero dot an infinite string of three" (also named
'[repeating decimal](https://en.wikipedia.org/wiki/Repeating_decimal) three')
can only be approximated. The quantity of memory to represent precisely 1/3 is infinite.
It is worth to remember any [irrational number](https://en.wikipedia.org/wiki/Irrational_number),
<math>\sqrt{2}</math> and π the most famous, can be only approximated in a computer architecture
because writing an irrational value needs an infinite number of digits.

From what explained above, albeit the IEEE-754 allows to express a wide range of values, the 16 decimal digit
precision is not sufficient for many purposes, like financial math, approximating values to cents (two digits),
the biggest value representable in any currency is 10<sup>14</sup> hence at most 10 trillions (10<sup>12</sup>)
of the currency units. Using more digits to represent fraction of cents to compute the
[compound interest](https://en.wikipedia.org/wiki/Compound_interest), the remaining digits allow to express
values in the range of billions, a too small range.

## Cryptocurrency Economy Math

Cryptocurrencies like [BTC](https://en.wikipedia.org/wiki/Bitcoin), [ETH](https://en.wikipedia.org/wiki/Ethereum) or
VeChain [VET](https://docs.vechain.org/introduction-to-vechain/dual-token-economic-model/vechain-vet) requires
18 decimal digits to express the fractional part their nomination currency unit, plus the digits required to
express the units, hence IEEE-754 is too coarse for the purpose of cryptocurrency economy.

The need of 18 digits for the fractional part of a cryptocurrency is suggested by the idea to express
cryptocurrency values as an integer value of its atomic smallest subunit named **wei**,
to honor the computer engineer [Wei Dai](https://en.wikipedia.org/wiki/Wei_Dai).

JS provides the
[`bigint`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
type, characterized to be a variable length type,
as [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String),
`bigint` expands to include all the bits needed to express any integer value, `bigint` values are limited by
available memory, hence practically unlimited.
However, if `bigint` is ideal to express currency values, it doesn't work well for any mathematics operation
involving the concept of ratio, as the division and root. Between integers, 1/3=0, not ideal when the same
result computed between real values returns 'repeating decimal' .3

## FixedPointNumber Type

The VeChain SDK provides the `FixedPointNumber` class to provide an unrestricted representation of values,
as `bigint` but supporting the concept of 'ratio' and rational numbers and allowing to define the precision
of the approximation of irrational values.

The most important characteristic of the `FixedPointNumber` class is the algorithms it provides are purely based
on `bigint` hence the code developed using the SDK runs smoothly on any JS runtime because `bigint` type is
a base type of the JS language.

### FixedPointNumber Compared With 'bignumber.js' Library

In JS there are other libraries addressing the same problem to represent with adjustable precision.
Among them, it is worth to name [**bignumber.js**](https://mikemcl.github.io/bignumber.js/).
The `FixedPointNumber` class was developed using **bignumber.js** as reference and benchmark:
most of the methods provided by the `FixedPointNumber` class have the same names and signature
of the same methods provided by **bignumber.js**. Being **bignumber.js** a popular and excellent library
to deal with financial math in JS, `FixedPointNumber` class is designed to make trivial to adapt code
developed for **bignumber.js** to run based on `FixedPointNumber`.

The reason the VeChain SDK provides its `FixedPointNumber` class instead of using **bignumber.js** is because
the algorithms implemented in the class allows a true unrestricted precision, just limited by the available memory,
those are simpler to verify manually, the source code links the abstract descriptions in math literature hence
everyone competent can verify those are correctly implement each non-trivial algorithm like the division,
the power exponentiation and square roots and strictly based on `bigint`.

The two libraries differ in the way they represent values.

The **bignumber.js** library encodes each value
similarly as IEEE-754 `number` using **significand**, **exponent** and **sign** properties, with the difference
the **significand** is an array of `numbers` (8 bytes per element) encoding each digit of the value to approximate,
for example the value -1.234567 × 10<sup>4</sup> is represented internally as

- **significand** = `[1,2,3,4,5,6,7]`
- **exponent** = `4`
- **sign** = `1` (to flag a negative value).

### FixedPointNumber Math

The `FixedPointNumber` class adopts a much simpler implementation inspired to the way the blockchain protocols,
like Bitcoin, Ethereum and Thor represents cryptocurrencies values.

- If the value is an integer, it's represented in a `bigint`.
- If the value is a rational value, hence it has a fractional part between ±1 and 0, it is scaled up multiplying itself
  by 10 for the number of times equal to the number of digits required to write the fractional part.

For this reason the `FixedPointNumber` exposes two properties, both of `bigint` type:

- `scaledValue` expresses the original value
    - if integer the integer itself,
    - if not integer the value multiplied by 10<sup>`fractionalDigits`</sum>
- `fractionalDigit` expresses the number of decimal digits required to write the fractional part of the value, it's `0`
  for integers.

For example 1.234567 is encoded as

- `scaledvalue = 1234567` (as 1.234567 × 10<sup>6</sup>),
- `fractionalDigit = 6`.

The expression 'fixed point' number means a `FixedPointNumber` objects use `fractionalDigit` to fix its
precision and pinpoint where the decimal separator, (the `.` dot character by default) is placed when the value
is printed.

## FixedPointNumber In Action

The `FixedPointNumber` class is part of the to the VeChain Data Model** hence, the .`of(exp: bigint | number | string)`
method is the standard way to create a new object from the `exp` argument.

In the following example shows the same value represented by two different type expressions create two equivalent
objects and how the `.bi` and `.n` properties behave.

```typescript
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
```

### Division Challenge

The arithmetic of the `FixedPointNumber` class is trivial for addition, subtraction and multiplication, the game
becomes interesting when the division is involved. Recalling the well known ratio 1/3, the result of the division
between `bigint` is zero and from above explanation, we know the object represents the internal operand as integers.

The `FixedPointNumber` class uses the `fractionalDigits` property to scale up and down the `scaledValue`
appropriately to a precision fine enough, by default when integers are involved the division, logarithm and root
operations internally scales up the value representation of 10<sup>20</sup> imposing an internal minimal precision
of 20 decimal digits, to be sure the result is accurate for the 18 digits the cryptocurrency math needs to represent any
value in terms of **wei** atomic subunits and have two digits more to approximate the less significant **wei** digit.

We will see later the `.dp(decimalPlaces: bigint | number)` method allows to fix the minimal required precision,
when two rational numbers are involved in a arithmetic operations risking leading to a loss of precision,
the internal math is caled uop to the double of the fractional digits of argument having the higher
`fractionalDigit` value.

For the 1/3 ratio the division is made between
10000000000000000000000000000000000000000/30000000000000000000000000000000000000000
hence the integer scaled up by 10<sup>default 20 fractional digit precision multiplied 2 times</sup>:
the division will return something like 0.33333333333333333333????????????????????
where the question mark acks as a placeholder for digits should be 3, but it will diverge from 3 as the digit is closer
to the less meaningful digit. As recalled many times, computers must approximate at some point.
Therm, the 40 digits internal precision is scaled down 10<sup>default 20 fractional digit</sup> preserving
an accurate results for the wished 20 fractional digits' precision.

The elegance of `FixedPointNumber` implementation is the precision is fixed, but expand and shrink internally to
assure at least the wished precision, consuming more memory only during the computation, returning to the
operating system after the result is computed, in any case consuming less memory than **bignumber.js**
implementation, the latter uses 8 bytes per each digit of precision.

The following example divide 1 by 3 comparing three results made by JS numbers, **bignumber.js** math and
`FixedPointNumber` math with the default precision of 20 fractional digits.

```typescript
// STEP 5: compute 1/3 comparing JS number, BigNumber and SDK FixedPointNumber math
x = FixedPointNumber.of(1);
y = FixedPointNumber.of(3);
let r = x.div(y);   // r for 'ratio'.
console.log(`${x}/${y} => JS = ${x.n / y.n};\tBigNumber = ${BigNumber(x.n).div(y.n)};\tSDK = ${r}`);
```

For sake of comprehension, the snipped above prints

```text
1/3 => JS = 0.33333333333333326;        BigNumber = 0.33333333333333328889;     SDK = 0.33333333333333333333
```

As expected JS `number` type math is precise in 16 digits included the integer `0` and the following fifteen `3`, then
diverge.

The **bignumber.js** math returns a 20 fractional digits ratio more precise than JS math but approximate for the last 4
digits. It's a good practice using **bignumber.js** to set a decimal precision with the same
`.dp(decimalPlaces: bigint | number)` in common with the `FixedPointNumber` class to a number of digits grater than
the minimal needed, then discard the last one where precision diverge. For example, needing at least 20 decimal
precision, set `.dp(25)` and discard the last five digits.

The SDK math returns the value closer to the theoretical real number ratio.

Let's see what happen when we increase the precision to 80 fractional digits.

```typescript
// STEP 6: increase the precision to 80 decimal digits.
let fd = 80;            // Fractional Digits.
x = x.dp(80);                   // Force x to fd precision, .div function will adapt y automatically
r = x.div(y);                   // Ratio
let a = BigNumber(x.n).dp(fd);  // Force to fd precision.
let b = BigNumber(y.n).dp(fd);  // Force to fd precision
let q = a.div(b)                // q for 'quotient' synonymous of 'ratio'.
console.log(`${x}/${y} => BigNumber ${q};\t SDK = ${r}`);
```

The code prints

```text
1/3 => BigNumber 0.33333333333333328889;         SDK = 0.33333333333333333333333333333333333333333333333333333333333333333333333333333333
```

because **bignumber.js** approximation algorithm converge to 0.33333333333333328889 followed by not meaningful zeros.
The `FixedPointNumber` is more accurate regarding divisions.

### Square Root Challenge

The next example computes the square root on few natural numbers, let's see how JS, **bignumber.js** and
`FixedPointNumber`  class behave.

```typescript
// STEP 7: compute the squared root of the natural number from 0 to n.
fd = 20;
let n = 8
let rows = [];
for (let i = 0; i <= n; i++) {
    x = FixedPointNumber.of(i).dp(fd).sqrt();
    a = BigNumber(i).dp(fd).sqrt();
    rows.push({
        'JS': Math.sqrt(i),
        'BigNumber': `${a}`,
        'SDK FixedPointNumber': `${x}`
    })
}
console.table(rows);
```

The code prints the table

```text
┌─────────┬────────────────────┬──────────────────────────┬──────────────────────────┐
│ (index) │ JS                 │ BigNumber                │ SDK FixedPointNumber     │
├─────────┼────────────────────┼──────────────────────────┼──────────────────────────┤
│ 0       │ 0                  │ '0'                      │ '0'                      │
│ 1       │ 1                  │ '1'                      │ '1'                      │
│ 2       │ 1.4142135623730951 │ '1.4142135623730950488'  │ '1.4142135623730950488'  │
│ 3       │ 1.7320508075688772 │ '1.73205080756887729353' │ '1.73205080756887729352' │
│ 4       │ 2                  │ '2'                      │ '2'                      │
│ 5       │ 2.23606797749979   │ '2.23606797749978969641' │ '2.2360679774997896964'  │
│ 6       │ 2.449489742783178  │ '2.4494897427831780982'  │ '2.44948974278317809819' │
│ 7       │ 2.6457513110645907 │ '2.6457513110645905905'  │ '2.6457513110645905905'  │
│ 8       │ 2.8284271247461903 │ '2.8284271247461900976'  │ '2.8284271247461900976'  │
└─────────┴────────────────────┴──────────────────────────┴──────────────────────────┘
```

where the divergence between **bignumber.js** and the `FixedPointNumber` is limited to the last less significant digit.

Once more is worth to repeat ther is not an always ideal way to approximate real numbers to the binary representation
computers provide, it's worth to repeat the previous experiment forcing the precision to 80 fractional digits, once more
**bignumber.js** converges to a result having less digits, `FixedPointNumber` math keep computing until the 80<sup>
th</sup>
digit internally resolving the computation with 160 digits.

The code

```typescript
// STEP 8: compute the squared root of the natural number from 0 to n.
fd = 80;
n = 8
rows = [];
for (let i = 0; i <= n; i++) {
    x = FixedPointNumber.of(i).dp(fd).sqrt();
    a = BigNumber(i).dp(fd).sqrt();
    rows.push({
        'JS': Math.sqrt(i),
        'BigNumber': `${a}`,
        'SDK FixedPointNumber': `${x}`
    })
}
console.table(rows);
```

prints

```text
┌─────────┬────────────────────┬──────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────┐
│ (index) │ JS                 │ BigNumber                │ SDK FixedPointNumber                                                                 │
├─────────┼────────────────────┼──────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────┤
│ 0       │ 0                  │ '0'                      │ '0'                                                                                  │
│ 1       │ 1                  │ '1'                      │ '1'                                                                                  │
│ 2       │ 1.4142135623730951 │ '1.4142135623730950488'  │ '1.41421356237309504880168872420969807856967187537694807317667973799073247846210703' │
│ 3       │ 1.7320508075688772 │ '1.73205080756887729353' │ '1.73205080756887729352744634150587236694280525381038062805580697945193301690880003' │
│ 4       │ 2                  │ '2'                      │ '2'                                                                                  │
│ 5       │ 2.23606797749979   │ '2.23606797749978969641' │ '2.23606797749978969640917366873127623544061835961152572427089724541052092563780489' │
│ 6       │ 2.449489742783178  │ '2.4494897427831780982'  │ '2.44948974278317809819728407470589139196594748065667012843269256725096037745731502' │
│ 7       │ 2.6457513110645907 │ '2.6457513110645905905'  │ '2.64575131106459059050161575363926042571025918308245018036833445920106882323028362' │
│ 8       │ 2.8284271247461903 │ '2.8284271247461900976'  │ '2.82842712474619009760337744841939615713934375075389614635335947598146495692421407' │
└─────────┴────────────────────┴──────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────┘
```

Note if you manually round the long SDK results to the digits printed in the **bignumber.js** result, you will get the
**bignumber.js** results.
The two libraries approximate the theoretical real number results consistently but `FixedPointNumber` works
with higher precision when instructed to do because it was designed to respect at least the 20 digits of fractional
precision cryptocurrency math requires.

### Limit Challenge

The `FixedPointNumber` class works as the JS `number` does to approximate the results at the limits.
The following examples computes the most classic limits of the division, by zero, by infinity and between zero arguments.

```typescript
// START-SNIPPET: FinancialMath_5
// STEP 9: compute the divisions by zero, infinity and between zeros.
r = x.div(FixedPointNumber.ZERO);
console.log(`${x}/0 = ${r}`);
r = x.div(FixedPointNumber.of(Infinity));
console.log(`${x}/infinity = ${r}`);
r = x.div(FixedPointNumber.ZERO.div(FixedPointNumber.ZERO));
console.log(`0/0 = is ${r}`);
```

Whatever is the last value of `x`, the code prints

```text
2.82842712474619009760337744841939615713934375075389614635335947598146495692421407/0 = Infinity
2.82842712474619009760337744841939615713934375075389614635335947598146495692421407/infinity = 0
0/0 = is NaN
```

as expected.
