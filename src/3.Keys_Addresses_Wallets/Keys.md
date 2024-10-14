## Lesson 3

# User's Keys and Addresses.

This SDK is used to let a JS/TS client to interact with the
[VeChain Thor](https://github.com/vechain/thor) blockchain.

Acting on the Thor blockchain requires actions are associated with a user.

Each user is identified by an **address**, albeit addresses identifies everything represented
in the blockchain.

Each user has a couple of keys related:
- the **private key** must be kept secret by the user,
- the **public key** can be shared with other parties.

The two keys are related in the following ways.
- A content encrypted with the public key of the user can be retrieved only by the associated private key of the user,
  hence once the content is encrypted, it is for the user's eyes only.
- A content encrypted with the private key of the user can be decrypted only with the public key of the same user,
  this operation acts as a digital signature because if the user encrypt a content made by data and its address
  with its private key, anyone else - knowing the user's address and public key - can decrypt the content reading
  the data and the address. If the decrypted address matches with the known address of the user, this means
  only that user can have encrypted the content.

  The private and public keys are related using a mathematic formula known as
  [elliptic curve](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm)
  The Thor blockchain uses a specific standardized algorithm to implement the elliptic curve formula,
  this algorithm is named [SECP256K1](https://en.bitcoin.it/wiki/Secp256k1).

  Later, this tutorial will explain how the concept of user is related with the following two concepts.
  - The **account** represents the assets of the user, or in other words, what a user has.
     Each account has one and only one user.
  - The **wallet** manages one or more accounts. This concept is similar to the wallet in the
    physical world: in a wallet there are money or cards giving us access to our account in the banks.
    In the cryptocurrency world, the blockchain infrastructure is the bank, the account is the equivalent
    of the credit/debit card and those have money.

The `Secp256k1` class provides the method `Secp256k1.generatePrivateKey()` to generate
a new randomized sequence of bytes acting as a private key.

The class `Secp256k1` provides a secure source of randomness, needed to create the private key.
The class code is based on code audited to be cryptographically secure.
Every class and method provided by the VeChain Data Model relevant for cryptography is based on
secure audited code.
The documentation shows `Notes: Security auditable method, depends on...`
listing and linking the cryptographic sensitive functions used.
Following the links, the user is able to trace back to the audit certification and check
the algorithm chain inn the cryptographic method is secure.

**Note:** the method `Secp256k1.generatePrivateKey()` is asynchronous because te operation can be long in some JS runtimes.

```typescript
// STEP 1: generate and print the private key calling `Secp256k1.generatePrivateKey()`.
import {Address, Hex, Secp256k1} from "@vechain/sdk-core";

const privateKey = await Secp256k1.generatePrivateKey();
console.log(`Private key is ${Hex.of(privateKey)}.`);
```

The private key is associated with its public key, the method `Secp256k1.derivePublicKey(privateKey)`
returns the public key associated with the private one.

```typescript
// STEP 2: from the private key derive and print the associated public key.
const publicKey = Secp256k1.derivePublicKey(privateKey);
console.log(`Public key is ${Hex.of(publicKey)}.`);
```

The elliptic curve formula associates the public key with an address.

The veChain Data Model provides the `Address` class extending the `Hex` class, in other words
an `Address` object is a hexadecimal expression inheriting oll the properties and methods of the `Hex` class
and of the `VeChainDataModel` interface.

```typescript
// STEP 3: get the address associated with the public key using the method `Address.ofPublicKey(publicKey)`.
const address = Address.ofPublicKey(publicKey);
console.log(`Address is ${address}.`);
```

The address expresses a big natural number, hence its byte array content can be meant as a positive `bigint` type.
Please, remember in JS/TS an array of bytes can be always interpreted as a positive `bigint` and the `Address`
object provides the `.bi` property because part of the VeChain Data Model.

The hexadecimal expression of the `Address` object from the step above shows a peculiar sequence of
uppercase and lowercase alphabetic digits. This sequence is computed because the algorithm described
in the [ERC-55: Mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55) and it is the
canonical form to express an address.

However, it is important to note, the `Address ` is an `Hex` object too, and
the case of the digits of the address doesn't have any meaning in terms of the value expressed in hexadecimal form.

The method `Address.ofPrivateKey(privateKey)` derives the address from the private key directly.
The `hexLowCaseAddress` express the address using only lowercase digits: later, we will create a new
`Address` object from `hexLowCaseAddress` and check of the `<VeChainDataModel>.isEqual(other)` methods

```typescript
// STEP 4: create an `Address` object from `hexLowCaseAddress` and check if it is equal to `address`.
const hexLowCaseAddress = Address.ofPrivateKey(privateKey).toString().toString();
const hypothesis = Hex.of(hexLowCaseAddress);
console.log(`Is ${address} Address object equal to the ${hypothesis} Hex object? ${address.isEqual(hypothesis)}.`);
```

The private key is the most sensitive piece of information the user has.
In the unlikely case a malicious software is running in parallel with the JS runtime,
the best practice is to destroy the private key after use.
Private and public keys are objects of the `Uint8Array` class in the VeChain SDK because those objects
are the most volatile in the memory space of the JS runtime.

Call `privateKey.fill(0)` when no more needed.

```typescript
// STEP 5: dispose the private key content.
privateKey.fill(0);
console.log(`Private key is ${Hex.of(privateKey)}.`);
```
