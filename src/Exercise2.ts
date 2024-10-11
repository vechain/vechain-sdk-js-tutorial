/*
THE BLOOM FILTER

The [Bloom Filter](https://en.wikipedia.org/wiki/Bloom_filter) is an array of bytes encoding a set of elements,
hashing each element in bits of the Bloom filter marking if the element belongs to the set originated the filter.

For any object, the Bloom filter tells if
- the object probably belongs to the set (false positive is possible),
- the object surely doesn't belong  to the set
originated the filter.

The advantage of the Bloom filter is to represent in a very compact form if some object is part of a data structure
expensive to query.
 */

/*
    For this exercise, some classes must be imported from the VeChain SDK core module.
 */
import {BloomFilter, Hex, Txt} from "@vechain/sdk-core";
// STEP 12: import the class `InvalidDataType` from `@vechain/sdk-errors`.
// import {InvalidDataType} from '@vechain/sdk-errors';


/*
   Here is defined a `set` of elements used make the Bloom Filter.
   Later we will check if any of them, is part of the filters built in this exercise.

   (The list is a subset of https://gist.github.com/fogleman/c4a1f69f34c7e8a00da8.)
 */
const set = [
    Txt.of('acrobat'),
    Txt.of('africa'),
    Txt.of('alaska'),
    Txt.of('albert'),
    Txt.of('albino'),
    Txt.of('album')
];

/*
 The VeChain Data Model provides a Bloom filter implementation provided by the `BloomFilter` class.

 The `BloomFilter.of(arg...) method accept zero, one or multiple elements to return a builder object
 of the `BloomFilterBuilder` class. Additional elements can be added later.
 */
// STEP 1: create an empty container object to create a Bloom filter. Use `BloomFilter.of` method.
// const bloomBuilder = BloomFilter.of();


/*
  To create a Bloom Filter from the Bloom filter builder container object, call the `<BloomFilterBuilder>.build()` method,
  this method returns an immutable object of the `BloomFilter` class.

  The method accepts two additional parameters to set how many bits are used to encode the fact an element is part of
  the Bloom filter array and how many hashing functions are used to do this. These parameters are explained
  in next exercise, those depend on the number of elements the originating set and the wished size of the resulting
  Bloom filter. The method `build()` estimates the proper number of bits and hashing functions from the number
  of elements added in the Bloom filter builder container object.
 */
// STEP 2: build an empty `BloomFilter` object.
// const emptyBloomFilter = bloomBuilder.build();


/*
  The method `BloomFilter.of` accepts a variable list og arguments according the
  [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
  to add arguments as elements of the set originating the Bloom filter.

  Since the Bloom filter is an array of bytes, the arguments are of the `Uint8Array` type encoding each content
  of the element; the arguments can be objects of the `Hex` class because the `Hex` class because
  the `Hex` class is a convenient way to express array of bytes.
 */
// STEP 3: build a Bloom filter adding all the elements of the `set`. Use `of` with the spread syntax, then `build`.
// const bloomFilter = BloomFilter.of(...set.map((element) => element.bytes)).build();


/*
  The `key` object is used to query the Bloom filter if it is part of its originating `set`. (Yes it is.)
 */
const key = set[0];

/*
  Since the `bloomFilter` is an object of the class `BloomFilter` implemnting the `VeChainDataModel` interface,
  it provides the `.bytes` properties hence the array being the Bloom filter can be conveniently expressed
  in hexadecimal form.

  The method `<BloomFilter>.contains(key)` return
  - `true` if the key likely has been part of the set of elements originated the Bloom filter,
  - `false` if surely hasn't been part of such set.
  The key can be an object of either the `Hex` or `Uint8Array` class.
 */
// STEP 4: print if `key` is part of the `bloomFilter`, use the `contains` method.
// console.log(`Is "${key}" in ${Hex.of(bloomFilter.bytes)} filter made from bytes?`);
// console.log(`${bloomFilter.contains(key.bytes)}`);


// STEP 5: print if `key` is part of the empty Bloom filter appropriately named `emptyBloomFilter` above.
// console.log(`Is "${key}" in ${Hex.of(emptyBloomFilter.bytes)} empty filter?`);
// console.log(`${emptyBloomFilter.contains(key.bytes)}`);


/*
   Elements can be added to the Bloom filter container builder as objects of the `Hex` class since
   this class is a handy way to express array of bytes.
 */
// STEP 6: add `set` elements to the `bloomBuilder` conntainer mapping the set's elements as `Hex` instances, then build the filter.
// set.forEach((element) => {
//     bloomBuilder.add(Hex.of(element.bytes))
// })
// const hexBloomFilter = bloomBuilder.build();


// STEP 7: print of the `key` is part of the Bloom filter made from hexadecimal expression.
// console.log(`Is "${key}" in ${Hex.of(hexBloomFilter.bytes)} filter made from hex?`);
// console.log(`${hexBloomFilter.contains(key.bytes)}`);

/*
  The objects `bloomFilter` built from `Uint8Array` elements and `hexBloomFilter` built from `Hex` elements
  should be identical.

  Being objects of the class `BloomFilter` implementing the `VeChainDataModel` interface, the method
  `isEqual` can be called to check if the two objects are equal. (Indeed, they are equal.)
 */
// STEP 8: prove `bloomBuilder` is equal to `hexBloomFilter`.
// console.log(`Is bloomBuilder equal to hexBloomFilter?`);
// console.log(bloomFilter.isEqual(hexBloomFilter));


/*
   Being objects of the VeChain Data Model, the Bloom filters made in this exercise provides the
   `.bi` property to represent the array of bytes as JS `bigint` expression.

   An array of bytes can be always represented as a `bigint` expression.
 */
// STEP 9: play with the VeChain Data Model, print `bloomFilter` casting it to `bigint`.
// console.log(`Cast to bigint: is ${bloomFilter.bi} === ${hexBloomFilter.bi}?`);
// console.log(bloomFilter.bi === hexBloomFilter.bi);


/*
  Instances of classes provided by the VeChain Data Model provide the `.n` property to cast its content to the
  JS `number` type. This is not at all meaningful for a Bloom filter, because it is an array of bytes,
  however since the `BloomFilter` class implements the `VeChainDataModel` interface, an empty Bloom filter cast to zero.
 */
// STEP 10: what is the value of an empty Bloom filter as `number` value?
// console.log(`Cast emptyBloomFilter as a number = ${emptyBloomFilter.n}.`);


/*
  Most of the time, a `BloomFilter` object represents an array of bytes not interpretable as a JS `number` type.
  If the result of the operation is not in the safe number range addressed by the `number` type, an exception is thrown.
 */
// STEP 11: cast `arrayBloomFilter` as JS `number` type.
// try {
//     console.log(`Cast arrayBloomFilter as a number = ${bloomFilter.n}.`);
// // STEP 13: catch the error.
// } catch (error) {
//     const invalidDataType = error as InvalidDataType;
//     console.error(`Cast arrayBloomFilter as a number throws "${invalidDataType.errorMessage}"!`);
// }


/*
  The `additionalSet` object is used to show how to join Bloom filters below.

  (The list is a subset of https://gist.github.com/fogleman/c4a1f69f34c7e8a00da8.)
 */
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

/*
  Two different Bloom filters can be joined if those are built with compatible bits per key representation and
  hashing function number.

  The method `isJoinable` checks if two `BloomFilter` objects are compatible to be joined.
 */
// STEP 14: can `additionalBloomFilter` join `bloomFilter` to make a filter representing the union of the sets originated the two filters? (Yes, in this case.)
// if (bloomFilter.isJoinable(additionalBloomFilter)) {
//     /*
//       The method `<BloomFilter>.join(other)` returns a new `BloomFilter` object representing the union of
//       this `<BloomFilter>` and the `other` one.
//
//       Elements of both `set` and `aditionalSet` objects should result as likely part of the union Bloom filter.
//      */
//     // STEP 15: for each element in both `set` and `additionalSet` print if it is part of their original Bloom filters and of the union of them.
//     const unionBloomFilter = bloomFilter.join(additionalBloomFilter);
//     console.log('Element in\tset\tadditional\tunion')
//     set.forEach((element) => {
//         const key = element.bytes;
//         const isInSet = bloomFilter.contains(key);
//         const isInAdditionalSet = additionalBloomFilter.contains(key);
//         const isInUnionSet = unionBloomFilter.contains(key);
//         console.log(`${element}\t\t${isInSet}\t${isInAdditionalSet}\t\t${isInUnionSet}`);
//     });
//     additionalSet.forEach((element) => {
//         const key = element.bytes;
//         const isInSet = bloomFilter.contains(key);
//         const isInAdditionalSet = additionalBloomFilter.contains(key);
//         const isInUnionSet = unionBloomFilter.contains(key);
//         console.log(`${element}\t\t${isInSet}\t${isInAdditionalSet}\t\t${isInUnionSet}`);
//     });
// }

/*
  Finally, the method `BloomFilter.of` returns an object of the `BloomFilterBuilder` class,
  this is a container where to add the elements represented by the Bloom filter.

  But what if I have a Bloom filter, that is a byte of arrays, and the `k` or `m` parameters?
  You should know at least one of the following
  - `m`: number of bits per key, or
  - 'k': number of hashing functions used to build the filter.

  Those parameters are explained in the next exercise, however something is anticipated here, the
  class `BloomFilter` exposes both the `.bytes` and `.k` properties hence having any object representing
  them in some form, you can always build a new `BloomFilter` object using its class constructor.

  If I have the `m` parameters `k = BloomFilter.computeBestHashFunctionsQuantity(m)`.

  Supposing the `k` parameter is known and the bloom filter is a byte array, you can build a new `BloomFilter` object
  with the `new` operator applied to its public Constructor.

  ```
  const k: number = ...
  const bytes = Uint8Array.of(...)
  const bloomFilter = new BloomFilter(bytes, k);
  ```
 */
// STEP 16: clone the bloomFilter.
// const cloneFilter = new BloomFilter(bloomFilter.bytes, bloomFilter.k);
// console.log(`Original ${Hex.of(bloomFilter.bytes)}, clone ${Hex.of(cloneFilter.bytes)}.`);

