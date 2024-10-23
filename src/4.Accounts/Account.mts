import {Address, Clause, Secp256k1, TransactionClause, VET, VTHO} from "@vechain/sdk-core";
import {THOR_SOLO_URL, ThorClient} from "@vechain/sdk-network";

const privateKey = await Secp256k1.generatePrivateKey();
const publicKey = Secp256k1.derivePublicKey(privateKey);
const address = Address.ofPublicKey(publicKey);

const clauses: TransactionClause[] = [
    Clause.transferVET(
        address,
        VET.of(10000)
    ) as TransactionClause
];

const transaction = {
    clauses: clauses
};

const thorClient = ThorClient.fromUrl(THOR_SOLO_URL);

const gasResult = await thorClient.gas.estimateGas(
    transaction.clauses
);

console.log(gasResult);

const txBody = await thorClient.transactions.buildTransactionBody(
    transaction.clauses,
    gasResult.totalGas
);

console.log(txBody);



thorClient.destroy();
