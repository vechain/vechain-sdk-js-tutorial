// START_SNIPPET: BloomFilter_Step0
// STEP 0: import and setup what needed.
import {BloomFilter, Hex, Txt} from "@vechain/sdk-core";

import {InvalidDataType} from '@vechain/sdk-errors';

const set = [
  Txt.of('acrobat'),
  Txt.of('africa'),
  Txt.of('alaska'),
  Txt.of('albert'),
  Txt.of('albino'),
  Txt.of('album')
];

// END_SNIPPET: BloomPart1__Step0

// START_SNIPPET: BloomPart1__Step1
// STEP 1: create an empty container object to create a Bloom filter. Use `BloomFilter.of` method.
const bloomBuilder = BloomFilter.of();

// END_SNIPPET: BloomPart1__Step1


// START_SNIPPET: BloomPart1__Step2
// STEP 2: build an empty `BloomFilter` object.
const emptyBloomFilter = bloomBuilder.build();

// END_SNIPPET: BloomPart1__Step2


// START_SNIPPET: BloomPart1__Step3
// STEP 3: build a Bloom filter adding all the elements of the `set`. Use `of` with the spread syntax, then `build`.
const bloomFilter = BloomFilter.of(...set.map((element) => element.bytes)).build();

// END_SNIPPET: BloomPart1__Step3


// START_SNIPPET: BloomPart1__Step4
// STEP 4: print if `key` is part of the `bloomFilter`, use the `contains` method.
// The `key` object is used to query the Bloom filter if it is part of its originating `set`. (Yes it is.)
const key = set[0];
console.log(`Is "${key}" in ${Hex.of(bloomFilter.bytes)} filter made from bytes?`);
console.log(`${bloomFilter.contains(key.bytes)}`);

// END_SNIPPET: BloomPart1__Step4


// START_SNIPPET: BloomPart1__Step5
// STEP 5: print if `key` is part of the empty Bloom filter appropriately named `emptyBloomFilter` above.
console.log(`Is "${key}" in ${Hex.of(emptyBloomFilter.bytes)} empty filter?`);
console.log(`${emptyBloomFilter.contains(key.bytes)}`);

// END_SNIPPET: BloomPart1__Step5


// START_SNIPPET: BloomPart1__Step6
// STEP 6: add `set` elements to the `bloomBuilder` conntainer mapping the set's elements as `Hex` instances, then build the filter.
set.forEach((element) => {
  bloomBuilder.add(Hex.of(element.bytes))
})
const hexBloomFilter = bloomBuilder.build();

// END_SNIPPET: BloomPart1__Step6


// START_SNIPPET: BloomPart1__Step7
// STEP 7: print of the `key` is part of the Bloom filter made from hexadecimal expression.
console.log(`Is "${key}" in ${Hex.of(hexBloomFilter.bytes)} filter made from hex?`);
console.log(`${hexBloomFilter.contains(key.bytes)}`);

// END_SNIPPET: BloomPart1__Step7


// START_SNIPPET: BloomPart1__Step8
// STEP 8: prove `bloomBuilder` is equal to `hexBloomFilter`.
console.log(`Is bloomBuilder equal to hexBloomFilter?`);
console.log(bloomFilter.isEqual(hexBloomFilter));

// END_SNIPPET: BloomPart1__Step8


// START_SNIPPET: BloomPart1__Step9
// STEP 9: play with the VeChain Data Model, print `bloomFilter` casting it to `bigint`.
console.log(`Cast to bigint: is ${bloomFilter.bi} === ${hexBloomFilter.bi}?`);
console.log(bloomFilter.bi === hexBloomFilter.bi);

// END_SNIPPET: BloomPart1__Step9


// START_SNIPPET: BloomPart1__Step10
// STEP 10: what is the value of an empty Bloom filter as `number` value?
console.log(`Cast emptyBloomFilter as a number = ${emptyBloomFilter.n}.`);

// END_SNIPPET: BloomPart1__Step10


// START_SNIPPET: BloomPart1__Step11_12
// STEP 11: cast `arrayBloomFilter` as JS `number` type.
try {
  console.log(`Cast arrayBloomFilter as a number = ${bloomFilter.n}.`);
// STEP 13: catch the error.
} catch (error) {
  const invalidDataType = error as InvalidDataType;
  console.error(`Cast arrayBloomFilter as a number throws "${invalidDataType.errorMessage}"!`);
}

// END_SNIPPET: BloomPart1__Step11_12

// START_SNIPPET: BloomPart1__Step13
// STEP 13: define an additional set
const additionalSet = [
  Txt.of('acrobat'),
  Txt.of('alcohol'),
  Txt.of('america'),
  Txt.of('april'),
  Txt.of('banana'),
  Txt.of('camera')
];

const additionalBloomFilter = BloomFilter.of(
  ...additionalSet.map((element) => element.bytes)
).build();

// END_SNIPPET: BloomPart1__Step13


// START_SNIPPET: BloomPart1__Step14_15
// STEP 14: can `additionalBloomFilter` join `bloomFilter` to make a filter representing the union of the sets originated the two filters? (Yes, in this case.)
if (bloomFilter.isJoinable(additionalBloomFilter)) {
  // STEP 15: for each element in both `set` and `additionalSet` print if it is part of their original Bloom filters and of the union of them.
  const unionBloomFilter = bloomFilter.join(additionalBloomFilter);
  console.log('Element in\tset\tadditional\tunion')
  set.forEach((element) => {
    const key = element.bytes;
    const isInSet = bloomFilter.contains(key);
    const isInAdditionalSet = additionalBloomFilter.contains(key);
    const isInUnionSet = unionBloomFilter.contains(key);
    console.log(`${element}\t\t${isInSet}\t${isInAdditionalSet}\t\t${isInUnionSet}`);
  });
  additionalSet.forEach((element) => {
    const key = element.bytes;
    const isInSet = bloomFilter.contains(key);
    const isInAdditionalSet = additionalBloomFilter.contains(key);
    const isInUnionSet = unionBloomFilter.contains(key);
    console.log(`${element}\t\t${isInSet}\t${isInAdditionalSet}\t\t${isInUnionSet}`);
  });
}

// END_SNIPPET: BloomPart1__Step14_15


// START_SNIPPET: BloomPart1__Step16
// STEP 16: clone the bloomFilter.
const cloneFilter = new BloomFilter(bloomFilter.bytes, bloomFilter.k);
console.log(`Original ${Hex.of(bloomFilter.bytes)}, clone ${Hex.of(cloneFilter.bytes)}.`);

// END_SNIPPET: BloomPart1__Step16
