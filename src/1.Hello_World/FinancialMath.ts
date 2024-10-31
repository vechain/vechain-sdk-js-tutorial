import { FixedPointNumber } from '@vechain/sdk-core';
import { BigNumber } from 'bignumber.js';

let x = FixedPointNumber.of(123.456789);
let y = FixedPointNumber.of('123.456789');
console.log(
    `FPN value ${x} from number is ${x.isEqual(y) ? '' : 'not'}equal to ${y} from string.`
);
console.log(`Cast FPN value to number is ${x.n}.`);
console.log(`Cast FPN value to bigint is ${x.bi}.`);

x = FixedPointNumber.of(1);
y = FixedPointNumber.of(3);
let r = x.div(y);
console.log(
    `FPN value = ${r}; JS value = ${x.n / y.n}; BigNumber value = ${BigNumber(x.n).div(y.n)}.`
);
x = x.dp(80); // must be updated
r = x.div(y);
console.log(`${r}`);

const dp = 20;
for (let n = 0; n <= 8; n++) {
    x = FixedPointNumber.of(n, BigInt(dp));
    r = x.sqrt();
    console.log(`${n}, ${r};\t${Math.sqrt(n)};\t${BigNumber(n).dp(dp).sqrt()}`);
}

// let dp = 20;
// for(let n = 0; n <= 8; n ++) {
//     x = FixedPointNumber.of(n, BigInt(dp));
//     r = x.sqrt();
//     console.log(`${n}, ${r};\t${Math.sqrt(n)};\t${BigNumber(n).dp(dp).sqrt()}`);
// }
