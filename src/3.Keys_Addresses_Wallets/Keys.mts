// START_SNIPPET: Keys_Step1
// STEP 1: generate and print the private key calling `Secp256k1.generatePrivateKey()`.
import {Address, Hex, Secp256k1} from "@vechain/sdk-core";

const privateKey = await Secp256k1.generatePrivateKey();
console.log(`Private key is ${Hex.of(privateKey)}.`);

// END_SNIPPET: Keys_Step1


// START_SNIPPET: Keys_Step2
// STEP 2: from the private key derive and print the associated public key.
const publicKey = Secp256k1.derivePublicKey(privateKey);
console.log(`Public key is ${Hex.of(publicKey)}.`);

// END_SNIPPET: Keys_Step2


// START_SNIPPET: Keys_Step3
// STEP 3: get the address associated with the public key using the method `Address.ofPublicKey(publicKey)`.
const address = Address.ofPublicKey(publicKey);
console.log(`Address is ${address}.`);

// END_SNIPPET: Keys_Step3


// START_SNIPPET: Keys_Step4
// STEP 4: create an `Address` object from `hexLowCaseAddress` and check if it is equal to `address`.
const hexLowCaseAddress = Address.ofPrivateKey(privateKey).toString().toString();
const hypothesis = Hex.of(hexLowCaseAddress);
console.log(`Is ${address} Address object equal to the ${hypothesis} Hex object? ${address.isEqual(hypothesis)}.`);

// END_SNIPPET: Keys_Step4


/*
  The private key is the most sensitive piece of information the user has.
  In the unlikely case a malicious software is running in parallel with the JS runtime,
  the best practice is to destroy the private key after use.
  Private and public keys are objects of the `Uint8Array` class in the VeChain SDK because those objects
  are the most volatile in the memory space of the JS runtime.

  Call `privateKey.fill(0)` when no more needed.
 */
// START_SNIPPET: Keys_Step5
// STEP 5: dispose the private key content.
privateKey.fill(0);
console.log(`Private key is ${Hex.of(privateKey)}.`);

// END_SNIPPET: Keys_Step5





