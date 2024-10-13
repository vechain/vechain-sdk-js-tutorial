/*
The user is who owns the private and public keys and the associated keys address.
The address od the user identifies its account in the blockchain,
the account refers the assets of the user.
The wallet is some software off the blockchain referring one or more accounts, in one or more
blockchains. Like in the real world, the wallet is a tool to leep accounts and their assets well
organized.
The user can have one or more accounts and wallets.

The previous examples explained the importance of the private key, that is the
secret keys allowing the user to access the account, in most cases through the wallet
managing the account. If the private key is lost, its owner loses all the owned assets in the
blockchain until the private key is retrieved.
For such reason the [BIP39 Mnemonic Words](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
introduced a way to map the bytes of the private key as a set of memorable words easy to learn and remind by heart.

Can a user have multiple accounts, and wallets. Yes, of course, but it could be inconvenient if a power user
having many accounts should be obliged to store secretly and memorize each private key for each account.
It would be more convenient if - like John Ronald Reuel Tolkien suggests in the book "The Lord of the Rings" -
the user could have a master private key used to derive any other private and public key and account a use wishes to
create. Paraphrasing the opening of the book, "...one key to rule them all".

The [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
rules how to derive private and public keys from a master pair of keys.

Since **BIP32** defines how to derive many keys for many accounts from a master key introducing the
concept of 'Hierarchical Deterministic Key' and every wallet has at least one account (with its address and keys
associated), in many documents the reader will find the term 'Hierarchical Deterministic Wallet'.
The concepts of 'Hierarchical Deterministic Key' and 'Hierarchical Deterministic Wallet' are strongly related
meaning a 'Hierarchical Deterministic Wallet' created to manage an account created with
a 'Hierarchical Deterministic Key'.

When a 'Hierarchical Deterministic Wallet' is involved, it means this wallet is owned and controlled by
the user having its 'Hierarchical Deterministic Key'.
 */

/*
  Recalling the previous exercises, a master private key is generated using
 */

import {HDKey, Hex, Mnemonic} from "@vechain/sdk-core";

const words = Mnemonic.of();
console.log(`Memorable words [${words}]`);

/*
  The VeChain SDK provides the `HDKey` class extending the equally named class
  provided by the popular library [scure-bpi32](https://github.com/paulmillr/scure-bip32),
  inheriting all the properties and methods, hence the `HDClass` offered by the VeChain SDK is
  a perfect drop-in replacement everywhere the `scure-bip32` library is used.
 */
// STEP 1: create the master key pair from mnemonic `words.
const master = HDKey.fromMnemonic(words);
console.log(`Master private ${Hex.of(master.privateKey)} and public ${Hex.of(master.publicKey)} keys.`);

/*
  From any `HDKey` instance, master included of course, an array of children keys can be derived,
  each of these children can derive a further level of keys; in other words each `HDKey` object can be
  the root of a tree of derived `HDKeys` objects.
 */

/*
  This constant defines how deep will be the tree of derived keys, considering the master genreated by
  mnemonics has an assigned depth = 4.
  You can play poking with this number.
 */
const maxDepth = 6;

/*
  This constant defines how manu children keys each key should spawn.
  You can play poking with this number.
 */
const crecheSize = 3;

/*
  The path for the root node is conventionally `m` for "master".
 */
// STEP 2: call `deriveChildren` to derive `crecheSize` per key until the tree od derived keys is `maxDepth` thick.
deriveChildrenKeys(master, 'm', maxDepth, crecheSize);

/*
  After use to authenticate the software to manage wallets and accounts,
  the master key should be dispose`d as soon as possible.
 */
// STEP 3: destroy the content of the master after use.
master.wipePrivateData()
try {
    console.log(`Master private ${Hex.of(master.privateKey)} and public ${Hex.of(master.publicKey)} keys.`);
} catch (error) {
    console.log('The master is gone.');
}

/**
 * This method derives children keys from a given parent key up to a specified depth and size.
 *
 * @param {HDKey} parent - The parent HDKey from which to derive child keys.
 * @param {string} parentPath - The hierarchical path of the parent key.
 * @param {number} maxDepth - The maximum depth to which children keys should be derived.
 * @param {number} crecheSize - The number of children keys to derive at each level.
 * @return {void} No return value.
 */
function deriveChildrenKeys(parent: HDKey, parentPath: string, maxDepth: number, crecheSize: number) {
    for(let i = 0; i < crecheSize; i ++) {
        const child = parent.deriveChild(i);
        const path = `${parentPath}/${child.index}`;
        console.log(`child at path ${path} private ${Hex.of(child.privateKey)} and public ${Hex.of(child.publicKey)} keys.`);
        if (child.depth < maxDepth) {
            deriveChildrenKeys(child, path, maxDepth, crecheSize);
        }
    }
}


