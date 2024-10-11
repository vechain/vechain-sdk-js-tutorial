/*
  The previous exercise showed how to create the private and public keys and the address of the user.
  The private key is an array of 32 bytes, often represented in hexadecimal form (hence 64 digits).
  The private key must be kept confidential, the blockchain infrastructure has not any knowledge of it,
  without the private key the user loses all what the user has represented in the blockchain.

  Since 64 digits are hard to remember, the
  [BIP39 Mnemonic Words](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
  specification introduced a way to relate content of the private key to a list of memorable words,
  these 'mnemonic' words are an alias of the private keys and those should be kept confidential.

  This exercise shows how to get a random list of 'mnemonic' words for a user and how to derive
  the private, public and address of the user from the 'mnemonic' words/
 */

/*
  The class `Mnemonic` provides the **BIP39** specifications.
 */
import {Address, Mnemonic, Secp256k1} from "@vechain/sdk-core";

/*
  The method `Mnemonic.of() returns a random list of English words, alias of **SECP256K1** private key.

  The generation of mneomin words should be done by some software using the SDK that is not the
  same software connecting with Thor, but a separate software running only for the time needed to generate
  the list of words, print them and stop.
  For a hypothetical virus running on parallel with the JS runtime, is easier to sniff a string then an array of buffer,
  strings stay in the memory of the JS runtime for unpredictable time and their content can be wiped.
  Since the memorable words are extracted by a dictionary published as part of the **BIP39** specifications, for
  the hypothetical virus is fairly easy to guess a string having some of the **BIP39** words is a privake key.

  The best practice is to write a separate software generating and printing the mnemonic words, this software
  should not the same interacting with Thor.
 */
// STEP 1: get a list of memorable words to be used as a private key alias.
const words = Mnemonic.of();


// STEP 2:print the mnemonic words.
console.log(words);

/*
  The `Mnemonic.toPrivateKey(words)` derives the private key as an array of bytes.
 */
// STEP 3: derive the private key.
const privateKey = Mnemonic.toPrivateKey(words);
const publicKey = Secp256k1.derivePublicKey(privateKey);
const address = Address.ofPublicKey(publicKey);
console.log(`The user who remembers "${words}" words has the ${address} address and its associated keys.`);
privateKey.fill(0);

