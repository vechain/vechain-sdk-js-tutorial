// START_SNIPPET: BIP32_Step0
// Recalling the previous lesson, create mnemonic words as alias of the private key.
import { HDKey, Hex, Mnemonic } from '@vechain/sdk-core';

const words = Mnemonic.of();
console.log(`Memorable words [${words}]`);

// END_SNIPPET: BIP32_Step0

// START_SNIPPET: BIP32_Step1
// STEP 1: create the master key pair from mnemonic `words.
const master = HDKey.fromMnemonic(words);
console.log(
    `Master private ${Hex.of(master.privateKey)} and public ${Hex.of(master.publicKey)} keys.`
);

// END_SNIPPET: BIP32_Step1

// START_SNIPPET: BIP32_Step2
// STEP 2: call `deriveChildren` to derive `crecheSize` per key until the tree od derived keys is `maxDepth` thick.
// This constant defines how deep will be the tree of derived keys.
// The master generated by mnemonics has an assigned depth = 4.
// You can play poking with this number.
const maxDepth = 6;

//  This constant defines how manu children keys each key should spawn.
// You can play poking with this number.
const crecheSize = 3;

// The path for the root node is conventionally `m` for "master".
deriveChildrenKeys(master, 'm', maxDepth, crecheSize);

// END_SNIPPET: BIP32_Step2

// START_SNIPPET: BIP32_Step3
// STEP 3: destroy the content of the master after use.
master.wipePrivateData();
try {
    console.log(
        `Master private ${Hex.of(master.privateKey)} and public ${Hex.of(master.publicKey)} keys.`
    );
} catch (error) {
    console.log('The master is gone. Error: ', error.message);
}

// END_SNIPPET: BIP32_Step3

// START_SNIPPET: BIP32_deriveChildrenKeys
/**
 * This method derives children keys from a given parent key up to a specified depth and size.
 *
 * @param {HDKey} parent - The parent HDKey from which to derive child keys.
 * @param {string} parentPath - The hierarchical path of the parent key.
 * @param {number} maxDepth - The maximum depth to which children keys should be derived.
 * @param {number} crecheSize - The number of children keys to derive at each level.
 * @return {void} No return value.
 */
function deriveChildrenKeys(
    parent: HDKey,
    parentPath: string,
    maxDepth: number,
    crecheSize: number
): void {
    for (let i = 0; i < crecheSize; i++) {
        const child = parent.deriveChild(i);
        const path = `${parentPath}/${child.index}`;
        console.log(
            `Child at "${path}": private ${Hex.of(child.privateKey)} and public ${Hex.of(child.publicKey)} keys.`
        );
        if (child.depth < maxDepth) {
            deriveChildrenKeys(child, path, maxDepth, crecheSize);
        }
    }
}

// END_SNIPPET: BIP32_deriveChildrenKeys
