/*
  THE BLOOM FILTER - ADVANCED TOPICS ON K AND M PARAMETERS.

  This exercise is optional, it covers the parameters
  - m: number of bits per key used to represent an element in the Bloom filter, and
  - k: number of hashing functions used to build the Bloom filter.

  The [Bloom filter](https://en.wikipedia.org/wiki/Bloom_filter)
  uses a number of hashing functions (named `k` in math literature) to map
  a set of elements in keys of `m` (as named in math literature) bits.

  The purpose of the Bloom Filter is to map in a compat array if any element is part of a much bigger set.

  This example builds a `set` of `setSites` element, the elements have a random value of `elementSize` bytes.
  For an element size of 8 bytes, the `set` for 1024 elements is 8 KiB long.
 */

/*
  Here is the import of the classes used in this exercise provided by the VeChain SDK core module.
 */
import {BloomFilter, Hex, Secp256k1} from "@vechain/sdk-core";

/*
  This is the set of the elements will be represented by two Bloom filters of different size, albeit both smaller than `set`.
 */
const set: Uint8Array[] = [];

/*
  This is the size of `set`, hence the number of elements added to the `set` next.
  You can play to poke with this number.
 */
const setSize = 1024;

/*
  This is the size in bytes of each element added to `set`.
  You can play to poke with this number.
 */
const elementSize = 8;

/*
  The loop add `setSize` randomized value elements to `set`.
 */
for(let i = 0; i < setSize; i++) {
    /*
      The class `Secp256k1` offers the method `Secp256k1.randomBytes` to get an array of randomized bytes
      each array `elementSize` long.

      `Secp256k1.randomBytes`provides a secure source of randomness, and it is based on code audited to be
       cryptographically secure.
       Every class and method provided by the VeChain Data Model relevant for cryptography is based on
       secure audited code.
       The documentation shows `Notes: Security auditable method, depends on...`
       listing and linking the cryptographic sensitive functions used.
       Following the links, the user is able to trace back to the audit certification and check
       the algorithm chain inn the cryptographic method is secure.
     */
    const element = Secp256k1.randomBytes(elementSize);
    console.log(`${i} -> ${Hex.of(element)}`);
    set[i] = element;
}

/*
  You already know how to create a Bloom filter from `set` because a previous exercise.
 */
const defaultBloomFilter = BloomFilter.of(...set).build();

/*
  Show the content and the length of the `defaultBloomFilter`.
  Note the Bloom filter is much lighter than `set`, for a key size of 8 bits, the filter is 1 KiB size.
 */
console.log(`Default filter is ${Hex.of(defaultBloomFilter.bytes)}.`);
console.log(`Default filter is ${defaultBloomFilter.bytes.length} bytes sized.`);


/*
  The `<BloomFilter>,k property returns the number of hashing functions used to map the elements in the filter.
  This number is named `k` in math literature.
 */
let k = defaultBloomFilter.k;

/*
  The `BloomFilter.computesBestBitPerKey` returns the best length of the key in bits. The key represents the element of
  the set in compact form as element of the filter.
 */
// STEP 1: get the number of bits per key `k` hashing functions map.
let m = BloomFilter.computeBestBitsPerKey(k);


// STEP 2: print how many hashing functions were used to build the default Bloom filter and each key length in bits.
console.log(`Default filter use k = ${k} hashing functions to map each element in m = ${m} bits per key.`);


/*
  Here we build a more compact Bloom filter imposing each key representing an element is only 4 bits long.
 */
m = 4;
// STEP 3: how many hashing functions are optimal to map the elements of a Bloom filter in `m` bits keys?
k = BloomFilter.computeBestHashFunctionsQuantity(m);


// STEP 5: build the more compact Bloom filter.
const compactBloomFilter = BloomFilter.of(...set).build(k, m);

// STEP 6: print the more `compactBloomFilter` content and its properties.
console.log(`Compact filter is ${Hex.of(compactBloomFilter.bytes)}.`);
console.log(`Compact filter is ${compactBloomFilter.bytes.length} bytes sized.`);
console.log(`Compact filter use k = ${k} hashing functions to map each element in m = ${m} bits per key`);

// STEP 6: prove each element of the `set` is represented in both filters,
set.forEach((element, i) => {
    const isInDefault = defaultBloomFilter.contains(element);
    const isInCompact = compactBloomFilter.contains(element);
    console.log(`#[${i}]\tElement ${Hex.of(element)} is in default filter: ${isInDefault}, in compact filter: ${isInCompact}.`);
});

// STEP 7: prove an `alien` element is not part of the originating `set` as not represented in both filters.
const alien = Secp256k1.randomBytes(elementSize);
const isInDefault = defaultBloomFilter.contains(alien);
const isInCompact = compactBloomFilter.contains(alien);
console.log(`Alien ${Hex.of(alien)} is in default filter: ${isInDefault}, in compact filter: ${isInCompact}.`);

