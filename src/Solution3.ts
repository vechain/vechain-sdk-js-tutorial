/*
  THE BLOOM FILTER - ADVANCED TOPICS
 */

import {BloomFilter, Hex, Secp256k1} from "@vechain/sdk-core";
import * as console from "node:console";

const setSize = 1024;

const set: Uint8Array[] = [];

const elementSize = 8;

for(let i = 0; i < setSize; i++) {
    const element = Secp256k1.randomBytes(elementSize);
    console.log(`${i} -> ${Hex.of(element)}`);
    set[i] = element;
}

const defaultBloomFilter = BloomFilter.of(...set).build();

console.log(`Default filter is ${Hex.of(defaultBloomFilter.bytes)}.`);
console.log(`Default filter is ${defaultBloomFilter.bytes.length} bytes sized.`);

let k = defaultBloomFilter.k;
let m = BloomFilter.computeBestBitsPerKey(k);

console.log(`Default filter use k = ${k} hashing functions to map each element in m = ${m} bits per key.`);

m = 4;
k = BloomFilter.computeBestHashFunctionsQuantity(m);

const compactBloomFilter = BloomFilter.of(...set).build(k, m);

console.log(`Compact filter is ${Hex.of(compactBloomFilter.bytes)}.`);
console.log(`Compact filter is ${compactBloomFilter.bytes.length} bytes sized.`);
console.log(`Compact filter use k = ${k} hashing functions to map each element in m = ${m} bits per key`);


set.forEach((element) => {
    const isInDefault = defaultBloomFilter.contains(element);
    const isInCompact = compactBloomFilter.contains(element);
    console.log(`Element ${Hex.of(element)} is in default filter: ${isInDefault}, in compact filter: ${isInCompact}.`);
});

const alien = Secp256k1.randomBytes(elementSize);
const isInDefault = defaultBloomFilter.contains(alien);
const isInCompact = compactBloomFilter.contains(alien);
console.log(`Alien ${Hex.of(alien)} is in default filter: ${isInDefault}, in compact filter: ${isInCompact}.`);


