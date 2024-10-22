// START_SNIPPET BloomPart2__Step0
import { BloomFilter, Hex, Secp256k1 } from '@vechain/sdk-core';

// This is the set of the elements will be represented by two Bloom filters of different size,
// albeit both smaller than `set`.
const set: Uint8Array[] = [];

// This is the size of `set`, hence the number of elements added to the `set` next.
// You can play to poke with this number.
const setSize = 1024;

//  This is the size in bits of each key representing the element in the `set`.
// You can play to poke with this number.
const elementKeySize = 8    ;

//  The loop add `setSize` randomized value elements to `set`.
for (let i = 0; i < setSize; i++) {
    const element = Secp256k1.randomBytes(elementKeySize);
    console.log(`${i} -> ${Hex.of(element)}`);
    set[i] = element;
}

// You already know how to create a Bloom filter from `set` because a previous exercise.
const defaultBloomFilter = BloomFilter.of(...set).build();

// Show the content and the length of the `defaultBloomFilter`.
// Note the Bloom filter is much lighter than `set`, for a key size of 8 bits, the filter is 1 KiB size.
console.log(`Default filter is ${Hex.of(defaultBloomFilter.bytes)}.`);
console.log(
    `Default filter is ${defaultBloomFilter.bytes.length} bytes sized.`
);

/*
  The `<BloomFilter>,k property returns the number of hashing functions used to map the elements in the filter.
  This number is named `k` in math literature.
 */
let k = defaultBloomFilter.k;

// END_SNIPPET BloomPart2__Step0

// START_SNIPPET BloomPart2__Step1
// STEP 1: get the number of bits per key `k` hashing functions map.
let m = BloomFilter.computeBestBitsPerKey(k);
console.log(
    `Default filter use k = ${k} hashing functions to map each element in m = ${m} bits per key.`
);

// END_SNIPPET BloomPart2__Step1

// START_SNIPPET BloomPart2__Step2
// STEP 2: how many hashing functions are optimal to map the elements of a Bloom filter in `m` = 4 bits keys?
m = 4;
k = BloomFilter.computeBestHashFunctionsQuantity(m);

// END_SNIPPET BloomPart2__Step2

// START_SNIPPET BloomPart2__Step3
// STEP 3: build the more compact Bloom filter.
const compactBloomFilter = BloomFilter.of(...set).build(k, m);

// END_SNIPPET BloomPart2__Step3

// START_SNIPPET BloomPart2__Step4
// STEP 4: print the more `compactBloomFilter` content and its properties.
console.log(`Compact filter is ${Hex.of(compactBloomFilter.bytes)}.`);
console.log(
    `Compact filter is ${compactBloomFilter.bytes.length} bytes sized.`
);
console.log(
    `Compact filter use k = ${k} hashing functions to map each element in m = ${m} bits per key`
);

// END_SNIPPET BloomPart2__Step4

// START_SNIPPET BloomPart2__Step5
// STEP 5: prove each element of the `set` is represented in both filters,
set.forEach((element, i) => {
    const isInDefault = defaultBloomFilter.contains(element);
    const isInCompact = compactBloomFilter.contains(element);
    console.log(
        `#[${i}]\tElement ${Hex.of(element)} is in default filter: ${isInDefault}, in compact filter: ${isInCompact}.`
    );
});

// END_SNIPPET BloomPart2__Step5

// START_SNIPPET BloomPart2__Step6
// STEP 6: prove an `alien` element is not part of the originating `set` as not represented in both filters.
const alien = Secp256k1.randomBytes(elementKeySize);
const isInDefault = defaultBloomFilter.contains(alien);
const isInCompact = compactBloomFilter.contains(alien);
console.log(
    `Alien ${Hex.of(alien)} is in default filter: ${isInDefault}, in compact filter: ${isInCompact}.`
);

// END_SNIPPET BloomPart2__Step6
