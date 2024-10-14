// START_SNIPPET: Bip39_Step1
// STEP 1: get a list of memorable words to be used as a private key alias.
import { Address, Mnemonic, Secp256k1 } from '@vechain/sdk-core';

const words = Mnemonic.of();

// END_SNIPPET: Bip32Snippet

// START_SNIPPET: Bip39_Step2
// STEP 2:print the mnemonic words.
console.log(words);

// END_SNIPPET: Bip39_Step2

// START_SNIPPET: Bip39_Step3
// STEP 3: derive the private key.
const privateKey = Mnemonic.toPrivateKey(words);
const publicKey = Secp256k1.derivePublicKey(privateKey);
const address = Address.ofPublicKey(publicKey);
console.log(
    `The user who remembers "${words}" words has the ${address} address and its associated keys.`
);
privateKey.fill(0);

// END_SNIPPET: Bip39_Step3
