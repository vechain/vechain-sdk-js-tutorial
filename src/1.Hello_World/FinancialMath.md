## Lesson 1 - Part 2

# Financial Math

JavaScript (JS) was designed as front-end language, providing the simpler data type to cope with the need
of rendering, initially just the `string` type to express texts and `number` or `bigint` types to compute math.
JS was not designed to be strongly typed language, but the language was designed to delegate at runtime
the assessment of the type to represent any variable according its content.
When the success of JS as 'browser language' made it popular as a more general purpose language,
the need to pinpoint the data type of variable pushed the creation of TypeScript (TS)
as a language derived by and compatible with JS. TS makes explicit the type definition of variables.

## Number Type Limits

The JS `number` type implements the 64
bits [Double Precision Floating Point](https://en.wikipedia.org/wiki/Double-precision_floating-point_format)
representation as the `double` type common in *C#*, *Java/Kotlin* and *Rust/Zig* programming languages.
This representation uses 8 bytes to approximate the value as follows

- 1 bit to represent the value **sign**,
- 11 bits to represent an **exponent**, one bit for the exponent sign and 2<sup>10</sup> = 0-1024 as exponent range
  value,
- 52 bits to represent an integer - named **significand** multiplied for the above **exponent** and **sign**,
  2<sup>52</sup> is roughly equal to 4500000000000000 (45 followed by fourteen zeros).

Any value can't be represented exactly as a product of the integers **significand** × **2<sup>exponent</sup>**
× **sign** is approximated with less precision for values very big or very small fraction, positive or negative doesn't
matter.

Actually, IEEE-754 represents precisely values in the range ±2.23×10<sup>−308</sup> to ±1.80×10<sup>308</sup> in 16
decimal digits comprehensive of the integer and fractional parts.

It's important to anticipate that, due to the finite quantity of computer memory and the binary nature of electronic
logic, computers can only represent values as polynomial expressions of powers of 2. Hence, any rational value not the
result of a ratio between two values made of powers of two, like **1/3** returning "zero dot an infinite string of
three" (also named '[repeating decimal](https://en.wikipedia.org/wiki/Repeating_decimal) three'), they
can only be approximated. The quantity of memory to represent precisely 1/3 is infinite.
It is worth to remember any [irrational number](https://en.wikipedia.org/wiki/Irrational_number),
$\sqrt{2}$ and π are the most famous, can be only approximated in a computer architecture
because writing an irrational value needs an infinite number of digits.

From what explained above, albeit the IEEE-754 allows to express a wide range of values, the 16 decimal digit
precision is not sufficient for many purposes, like financial math. For example, approximating values to cents (two
digits), the biggest value representable in any currency is 10<sup>14</sup> hence at most 10 trillions (10<sup>12</sup>)
of the currency units. Using more digits to represent fraction of cents to compute the
[compound interest](https://en.wikipedia.org/wiki/Compound_interest), the remaining digits allow to express
values in the range of billions, this is a too small range.

## Cryptocurrency Economy Math

Cryptocurrencies like [BTC](https://en.wikipedia.org/wiki/Bitcoin), [ETH](https://en.wikipedia.org/wiki/Ethereum) or
VeChain [VET](https://docs.vechain.org/introduction-to-vechain/dual-token-economic-model/vechain-vet) requires
18 decimal digits to express the fractional part of their nomination currency unit, plus the digits required to
express the units, hence the IEEE-754 precision is too coarse for the purpose of cryptocurrency economy.

The need of 18 digits for the fractional part of a cryptocurrency is suggested by the idea to express
cryptocurrency values as an integer value of its atomic smallest subunit named **wei**,
to honor the computer engineer [Wei Dai](https://en.wikipedia.org/wiki/Wei_Dai).

JS provides the
[`bigint`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
type, characterized to be a variable length type,
as [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) is.
The `bigint` type expands to include all the bits needed to express any integer value,
`bigint` values are limited by available memory of the JS runtime.
However, if `bigint` is ideal to express currency values, it doesn't work well for any mathematics operation
involving the concept of ratio, as the division and root. Between integers, 1/3=0, not ideal when the same
result computed between real values returns 'repeating decimal' .3.

## FixedPointNumber Type

The VeChain SDK provides the `FixedPointNumber` class to provide an unrestricted representation of values,
as `bigint` but supporting the concept of 'ratio' and rational numbers, allowing to define the precision
of the approximation of irrational values.

The most important characteristic of the `FixedPointNumber` class is the algorithms it provides are purely based
on `bigint` hence the code developed using the SDK runs smoothly on any JS runtime because `bigint` type is
a base type of the JS language.

### bignumber.js comparison

In JS there are other libraries addressing the same problem to represent values with adjustable precision.
Among them, it is worth to name [**bignumber.js**](https://mikemcl.github.io/bignumber.js/).
The `FixedPointNumber` class was developed using **bignumber.js** as reference and benchmark:
most of the methods provided by the `FixedPointNumber` class have the same names and signature
of the same methods provided by **bignumber.js**. Being **bignumber.js** a popular and excellent library
to deal with financial math in JS, `FixedPointNumber` class is designed to make trivial to adapt code
developed for **bignumber.js** to run based on `FixedPointNumber`.

The reason the VeChain SDK provides its `FixedPointNumber` class instead of using **bignumber.js** is because
the algorithms implemented in the class allows a true unrestricted precision, just limited by the available memory,
those are simpler to verify manually, the source code links the abstract descriptions in math literature hence
everyone competent can verify those are correctly implemented for each non-trivial algorithm like the division,
the power exponentiation and square roots. All algorithms are strictly based on `bigint`.

The two libraries differ in the way they represent values.

The **bignumber.js** library encodes each value
similarly as IEEE-754 `number` using **significand**, **exponent** and **sign** properties, with the difference
the **significand** is an array of `numbers` (8 bytes per element) encoding each digit of the value to approximate.
For example, the value -1.234567 × 10<sup>4</sup> is represented internally as

- **significand** = `[1,2,3,4,5,6,7]`
- **exponent** = `4`
- **sign** = `1` (to flag a negative value).

The mention and comparison with **bignumber.js** is due because `FixedPointNumber` class doesn't implement
the whole functionalities of the **bignumber.js** library. For example `FixedPointNumber` class supports
the square root operation, but it doesn't support yet the power to fractional exponent (n<sup>0.5/sup> = $\sqrt{n}$).

**_NOTE:_** VeChain uses and suggests to use [**bignumber.js**](https://mikemcl.github.io/bignumber.js/)
for the functionalities not included in the `FixedPointNumber` class. The **bignumber.js** library
is not part of the SDK and must be imported explicitly in any JS/TS project using it.

### FixedPointNumber math

The `FixedPointNumber` class adopts a much simpler implementation inspired to the way the blockchain protocols,
like Bitcoin, Ethereum and Thor represents cryptocurrencies values.

- If the value is an integer, it's represented in a `bigint`.
- If the value is a rational value, hence it has a fractional part between ±1 and 0, it is scaled up multiplying itself
  by 10 for the number of times equal to the number of digits required to write the fractional part.

For this reason the `FixedPointNumber` exposes two properties, both of `bigint` type:

- `scaledValue` expresses the original value
    - if integer the integer itself,
    - if not integer the value multiplied by 10<sup>`fractionalDigits`</sum>;
- `fractionalDigit` expresses the number of decimal digits required to write the fractional part of the value, it's `0`
  for integers.

For example 1.234567 is encoded as

- `scaledvalue = 1234567` (as 1.234567 × 10<sup>6</sup>),
- `fractionalDigit = 6`.

The expression 'fixed point number' means a `FixedPointNumber` objects uses `fractionalDigit` to fix its
precision and pinpoint where the decimal separator, (the `.` dot character by default) is placed when the value
is printed.

## FixedPointNumber In Action

The `FixedPointNumber` class is part of the VeChain Data Model** hence, the .`of(exp: bigint | number | string)`
method is the standard way to create a new object from the `exp` argument.

The following example shows the same value, represented by two different type expressions, creates two equivalent
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

### Division challenge

The arithmetic of the `FixedPointNumber` class is trivial for addition, subtraction and multiplication, the game
becomes interesting when the division is involved. Recalling the well known ratio 1/3, the result of the division
between `bigint` is zero and from above explanation, we know the object represents the internal operand as integers.
How `FixedPointNumber` class solves the challenge to get a rational result from integer division?

The `FixedPointNumber` class uses the `fractionalDigits` property to scale up and down the `scaledValue`
appropriately to a precision fine enough, by default when integers are involved in the division, logarithm and root
operations internally, the class' algorithms scale up the value representation of 10<sup>20</sup>
imposing an internal minimal precision of 20 decimal digits,
to be sure the result is accurate for the 18 digits the cryptocurrency math needs to represent any
value in terms of **wei** atomic subunits, have two spare digits more to approximate the less significant **wei** digit.

We will see later the `.dp(decimalPlaces: bigint | number)` method allows to fix the minimal required precision.
When two rational numbers are involved in arithmetic operations risking leading to a loss of precision,
the internal math is scaled up to the double of the fractional digits of argument having the higher
`fractionalDigit` value using the `.dp` method.

For the 1/3 ratio the division is made between
10000000000000000000000000000000000000000 / 30000000000000000000000000000000000000000,
hence the integer is scaled up by 10<sup>default 20 fractional digit precision multiplied 2 times</sup>:
the division will return something like 0.33333333333333333333????????????????????
where the question mark acts as a placeholder for digits should be 3, but it will diverge from 3 as the digit is closer
to the less meaningful digit. As recalled many times, computers must approximate at some point.
Then, the 40 digits internal precision is scaled down 10<sup>default 20 fractional digit</sup> preserving
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
it diverges.

The **bignumber.js** math returns a 20 fractional digits ratio more precise than JS math but approximate for the last 4
digits.
It's a good practice using **bignumber.js** to set a decimal precision, calling the same
`.dp(decimalPlaces: bigint | number)` method in common with the `FixedPointNumber` class, to a number of digits greater
than the minimal needed, then discard the last ones where precision diverge. For example, needing at least 20 decimal
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

### Square root challenge

The next example computes the square root of few natural numbers, let's see how JS, **bignumber.js** and
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
        'JS number': Math.sqrt(i),
        'BigNumber': `${a}`,
        'SDK FixedPointNumber': `${x}`
    })
}
console.table(rows);
```

The code prints the table

```text
┌─────────┬────────────────────┬──────────────────────────┬──────────────────────────┐
│ (index) │ JS number          │ BigNumber                │ SDK FixedPointNumber     │
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

Once more, is worth to repeat there is not an always ideal way to approximate real numbers to the binary representation
computers provide, it's worth to repeat the previous experiment forcing the precision to 80 fractional digits, once more
**bignumber.js** converges to a result having less digits, `FixedPointNumber` math keep computing until the 80<sup>
th</sup> digit, internally resolving the computation with 160 digits.

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
        'JS number': Math.sqrt(i),
        'BigNumber': `${a}`,
        'SDK FixedPointNumber': `${x}`
    })
}
console.table(rows);
```

prints

```text
┌─────────┬────────────────────┬──────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────┐
│ (index) │ JS number          │ BigNumber                │ SDK FixedPointNumber                                                                 │
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

### Limit challenge

The `FixedPointNumber` class works as the JS `number` does to approximate the results at the limits.
The following examples computes the most classic limits of the division, by zero, by infinity and between zero
arguments.

```typescript
// START-SNIPPET: FinancialMath_5
// STEP 9: compute the divisions by zero, infinity and between zeros.
r = x.div(FixedPointNumber.ZERO);
console.log(`${x}/0 = ${r}`);
r = x.div(FixedPointNumber.of(Infinity));
console.log(`${x}/Infinity = ${r}`);
r = x.div(FixedPointNumber.ZERO.div(FixedPointNumber.ZERO));
console.log(`0/0 = ${r}`);
```

Whatever is the last value of `x`, the code prints

```text
2.82842712474619009760337744841939615713934375075389614635335947598146495692421407/0 = Infinity
2.82842712474619009760337744841939615713934375075389614635335947598146495692421407/Infinity = 0
0/0 = NaN
```

as expected.

### Compound Interest  challenge

The [Compount Interest](https://en.wikipedia.org/wiki/Compound_interest)
is the result of reinvesting or retaining interest that would otherwise be paid out from a capital,
or of the accumulation of debts from a borrower.

From the referred literature the formula to compute the

- *A*: accrued amount, from the
- *P* := principal capital, at the
- *r* := [nominal annual interest rate](https://en.wikipedia.org/wiki/Nominal_interest_rate), when accrued
- *n* := times per
- *t* := number of years in decimal form, hence 6 month = 0.5

is the following expression.

$$A=P(1+{r \over n})^{nt}$$

The following snipped shows how to implement the above formula with the `FixedPointNumber` class
for the simpler case of 10,000 currency units invested at 15% of interest rate annually.

```typescript
// STEP 10: compute the simple interest reat for 10,000 currency unit at 15% for one year
let P = 10000; // 10,000 $
let R = 0.15; // 15% interest rate
let N = 1; // interest accrued times per year
let T = 1; // 1 year of investment time
let jsA = interestWithNumberType(P, R, N, T);
console.log(
    `JS number            => ${P} at ${R} accrued ${N} per year for ${T} years = ${jsA} `
);
let bnA = interestWithBigNumberType(P, R, N, T);
console.log(
    `BigNumber            => ${P} at ${R} accrued ${N} per year for ${T} years = ${bnA} `
);
let fpA = interestWithFixedPointNumberType(P, R, N, T);
console.log(
    `SDK FixedPointNumber => ${P} at ${R} accrued ${N} per year for ${T} years = ${fpA} `
);

```

The above code prints

```text
JS number            => 10000 at 0.15 accrued 1 per year for 1 years = 11500
BigNumber            => 10000 at 0.15 accrued 1 per year for 1 years = 11500
SDK FixedPointNumber => 10000 at 0.15 accrued 1 per year for 1 years = 11500
```

where the math is simple.

It becomes interesting to understand if we could have accrued in the capital the interests once per day,
the code becomes

```typescript
P = 10000; // 10,000 $
R = 0.15; // 15% interest rate
N = 365; // interest accrued times per day
T = 1; // 1 year of investment time
jsA = interestWithNumberType(P, R, N, T);
console.log(
    `JS number            => ${P} at ${R} accrued ${N} per year for ${T} years = ${jsA} `
);
bnA = interestWithBigNumberType(P, R, N, T);
console.log(
    `BigNumber            => ${P} at ${R} accrued ${N} per year for ${T} years = ${bnA} `
);
fpA = interestWithFixedPointNumberType(P, R, N, T);
console.log(
    `SDK FixedPointNumber => ${P} at ${R} accrued ${N} per year for ${T} years = ${fpA} `
);
```

that prints the following output.

```text
JS number            => 10000 at 0.15 accrued 365 per year for 1 years = 11617.984431282737
BigNumber            => 10000 at 0.15 accrued 365 per year for 1 years = 11617.984431282297580741332627901777130315693092582736415183243388318237491778342908385720809654240040970598789674377765947470867911564401090655498297277650975577399724748298427632216300469085882205126498872953842419903091295485650124501686949728680155745247474335138232482179528909255366536402392875329941467045245858869644197239128719066296683081367462543205390000804087922075544539860855742520269818193809495203557007634259996219745309932882459518798524968113901703633929888998635141912068168058452472183416934462187935057393732956042640561423418567082114578032214061928405512072912635929995221365892079381592086022940837672235708964650239008816227116838590877049591322964899152767454901676441240192497489253888772433181792034083619461274791847315352488935494000067256440171197925364612917886966149610377974675067875969329030185742031433985309342124192478167223066139006719604689359394196296969241000167807707526911942624844129728153376077127099662124501925926262400807908100667459068640705163071829628876166416144650604075464967358748105805082716622225378985664759817456721566584649980686571966739424426900555857787691088510512370790518609850265247504195307410003670920350652938085871229040577564845370642100134126774852650664481607739716900248270176440329598644103824418655594316501156008480980716682782242614278880139844472436437042938201287303745900970102452173445939781488072924165863076960481844351048526193390029595200330434638261284649942836277464922095624061067458197847435464948760326222404388856873196780809435008547776084396323890431631972013758894777140309741935129390297015768713582643582348068171065563802650256565960065201047582581116691865279018481443083634133404456871734224588349932851240939902278852857772240874090103073366139194999398085913528002041787949791674995548809236904350253066698952181458954491521587600763302070101055709667346467178274981943340531021522745779841173173100876264702725095018516677824199733818142804282300961031747257156885200868283262162552850804621026592584042666050361511605692823276578862937221646249263387226746019107252022914312737706377194312459934216793950004099882178225338416417778346328972245140417878899256520398132742852152375062744008410226501238905946472866254396245283539337213331252101745238242758925097416813000735388071657272215630320845974338897771656555041763973550598236914984192269963986648377816228129380629038592368286598983134185222188166799690901539746460579787203029749770287168278013060365079064355083674125148509306763746692482514248137552297251646678328412875814259875291593503972546227382158958840236846540788238035029805960355494051129276122800357236219110138260911217725961189217381637291618712318040507760126364551859509154428340741101957780412277285523094815506659402101296679158236819278380864803586590895640024979637785001490636069382753310067262080662008374551411237242197309339195940406115487850125037507130818294504053083257596428408392560703205549675447339493801368201043030474759039019262194914203062392087296343396390456485525267865121108385382592954860634880962986192817267439352666847666157489902571135514525578918745486509804822731475416985234489977625440493130772022775991189276290027329665587185531530543206454536574667659589367011127224587509531212717181754469270666867381661716929585894830103402709693499856666380325736846063373961108804197128223849684167133844214462156301412887963361227739403071660047619772673714272672989566030756704912026202806904414756141050877173820467126821863214589542154214507220674770172074480518122963953827143784132131825710319355839177131961519962164573936360504510921943071620721478225732241696092470545416711449091231197409947570800111816988728323993927748087694375103322002551786532908225959918071812885153862720547036040176234585041356183336408463671774717112402126019277392052386242595710299970836973058795919985261217215532463448040471027097475516349207504695405799630225500316467665530686280496720382451548335866755027079968901476069244547605637114883551093053617935204887355249377970202741626315706124691277605917831773229234758966829205297909455982503322015748307649778207164102031977513233675014015393778284541528252684639556356440622270627351404365171320231057321728478194017365783885424667313087866411074216194345063051555381054064172603323211738852864410237985108247729834346660957553062456473858762927866393100596426722935498446318146888420749640452411934666892103469174673382975989047523845717274521847403271371069986619972541545134253842186788375129293688126572862115387719324965105989737112901937915991076889355410549661930187265953467401303864531898460980266601723832501816138179044919871086722233148280249031510561730844340942342552752797339969515184261652305893177119221594180785248835404646836951992084403389209903064614958108955775017427938729861471896432889143754999514215866581787875780518195492324090030209238689898749847097547332201970042332361179187882205382279489123276038554324542376299699431748417940616697963498398453267693487839206000992468170890787809074465833833196463153840816879434824909726841353267661992302221702086547490035887290185256786019556867916403856180613548209407427428077370808423244926090002052378929146269431360111728923038525642285848635701334548272961940575527578214830306877087295496043094370029968461721725931122906959895776924708699238003938445300122852634182483059734712134447129574528252224219402082590956703689919029030659233330544907648740772169481354518754802501356274798096471385614129581771624648999966708748460996049922163688691654080111831302649842118325696763454547261669119872910738319187020169833406880898955868935770271402602941664640045686162116748081874962518451448492409874925161119248814895310170073897053291015297428406688653811585699741373977572356288036024901500826634896249641517953519216217122274853273198117378197515066390088275104495779954424594351352378367504170370879233091766599335920101029085831254897829565278260692483037266835050591587628531733520004295815824586141378604375739933891004253354434850469067291902679358555199320950619712947450075798438078077536095433962891948700437561843125672228886857921426124413819322261040245713801881593557146574769577389858802213472120864318927179303450317314525085067389652207907199919225422117470334759242721216889842249001301391538464988190653091063509157979978283643327678457770510881671899296170914332781679190799498034101397504720140904971144170292408274384079420894326525665371636278322421273278426258321203221354484372505412649801255887345653780015097250209794039905314799983216469415302328198528313913445705434316109137813061851157444468570986979549798365340231124713689691546533719643932708191712713553794071778556027123472573813780229986257007757249006153795993810131914431558015307058287798711665470068967296921977705979849136618985820319515622500964455777206091165624522977628174471858620757943222409585380288039284091830621551632490845848868973849571519283631765833497270062040941078383405528284681354175222701039860699557935839377689676090845746980725178910930934668502448387038652955220237816656950225719626759719896877157902206341245898584211319540483952858211899601220699880254374817804694710554521371836044904856003205531183610678081768092129075647044919307768538250858692323989632797219472711805573349208751209872914132180689485824
SDK FixedPointNumber => 10000 at 0.15 accrued 365 per year for 1 years = 11617.9844312822975648
```

The output shows, if the approximation is acceptable, **bignumber.js** and `FixedPointNumber` class results are closer,
but `FixedPointNumber` converge to a solution in the fraction digits, here 20 by default.

From above, it is evident how much the compound interest formula is convenient for the lender (usually the bank) and not
for the borrower.

The two snippets above uses the following functions.

```typescript
// START-SNIPPET: FinancialMath_Functions
// COMPOUND INTEREST FUNCTIONS FOR DIFFERENT DATA TYPES
function interestWithBigNumberType(
    P: number,
    r: number,
    n: number,
    t: number
): BigNumber {
    const _P = BigNumber(P);
    const _r = BigNumber(r);
    const _n = BigNumber(n);
    const _t = BigNumber(t);
    return BigNumber(1).plus(_r.div(n)).pow(_t.times(_n)).times(_P);
}

function interestWithFixedPointNumberType(
    P: number,
    r: number,
    n: number,
    t: number
): FixedPointNumber {
    const _P = FixedPointNumber.of(P);
    const _r = FixedPointNumber.of(r);
    const _n = FixedPointNumber.of(n);
    const _t = FixedPointNumber.of(t);
    return FixedPointNumber.ONE.plus(_r.div(_n))
        .pow(_t.times(_n))
        .times(_P);
}

function interestWithNumberType(
    P: number,
    r: number,
    n: number,
    t: number
): number {
    return (1 + r / n) ** (t * n) * P;
}
```

where you can play to adjust the precision in the `interestWithFixedPointNumberType` and `interestWithBigNumberType`
functions, poking with the `.dp` method.

You can verify math using a
[compound interest calculator](https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator)
online.
