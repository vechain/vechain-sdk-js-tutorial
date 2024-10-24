## Lesson 1 - Part 2

# Financial Math

JavaScript (JS) was designed as front-end language, providing the simpler data type to cope with the need
of rendering, initially just the `string` type to express texts and `number` and `bigint` types to compute math.
JS was not designed to be strongly typed language, but the language was designed to delegate at runtime
the assessment of the type to represent any variable according its content.
When the success of JS as 'browser language' made it popular as a more general purpose language,
the need to pinpoint the data type of a variable pushed the creation of TypeScript (TS)
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
cryptocurrency values as an integer value of its atomic smallest sub-unit named **wei**,
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

The reason the VecHain SDK provides its `FixedPointNumber` class instead of using **bignumber.js** is because
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
