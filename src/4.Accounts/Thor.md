## Lesson 4 - Part 1

# Thor networks - 'mainnet', 'testnet' and 'solo'

VeChain develops and provides the **[Thor](https://docs.vechain.org/core-concepts/networks)** blockchain networks.

The **[mainnet](https://docs.vechain.org/core-concepts/networks/mainnet)**
refers to the live, operational version of a blockchain network.
It is the real, functioning blockchain network that is open to the public
and used by participants to conduct actual transactions, store data, and execute smart contracts.

The **[testnet](https://docs.vechain.org/core-concepts/networks/testnet)**
is a testing environment where developers and users can experiment prior
to deploying code to the blockchain production network, referred to as **mainnet**.
The **testnet** is essentially a separate blockchain networks that
mirrors the functionality of the **mainnet** but is isolated from it.

The **Thor** **[solo](https://docs.vechain.org/core-concepts/networks/thor-solo-node)** is a local
instance of **Thor** operating a single node that independently maintains and validates the entire blockchain network.
In other words, a **solo** node does not rely on other nodes for validation and verification of transactions and blocks.
Instead, it performs all the necessary tasks on its own.
Therefore, running a Thor **solo** node is essentially running the VeChainThor node software but not connecting it
to other network participants in **mainnet** or **testnet**.

The **solo** node network instance is very convenient to develop and test software for the VeChain Thor network
without the need to be connected to **testnet** for the development, everything can be done in local.

The following of this tutorial uses **Thor solo** to show how to develop software for the VeChain networks.

## Start and stop Thor 'solo'

The link at [How to run a Thor 'solo' node network](https://docs.vechain.org/how-to-run-a-node/how-to-run-a-thor-solo-node)
explains how to install and configure a Thor **solo** network.

The most convenient way to run a **solo** node network is to run it in a
**[docker](https://docs.vechain.org/how-to-run-a-node/how-to-run-a-thor-solo-node#docker-containerized-convenience)**
container.

The following guides shows how to install
 - **[docker](https://docs.docker.com/get-started/get-docker/)**
   and **[docker compose](https://docs.docker.com/compose/install/)**, or
 - **[docker desktop](https://docs.docker.com/desktop/)**
in your computer.

Once **docker** and **docker compose** or **docker desktop** - that includes **docker compose** - are installed,

1. move to the directory of the SDK, conventionally referred as `<vechain-sdk-js>` in this document;
2. to start **solo** open the [CLI](https://en.wikipedia.org/wiki/Command-line_interface) shell and type
   ```shell
   docker compose -f docker-compose.thor.yml up -d --wait
   ```
3. and to stop **solo**, type in shell
   ```shell
   docker compose -f docker-compose.thor.yml down
   ```
.

## Start and stop Thor 'solo' with `yarn`

Since you are reading this tutorial, there are excellent chances you read it to develop software with the help of the
SDK, hence you should have already installed both
- [Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs), and
- [Yarn](https://classic.yarnpkg.com/en/docs/install), hence

you can start **solo** typing in the shell

```shell
yarn start-thor-solo
```

and stop it later typing in the shell

```shell
yarn stop-thor-solo 
```
.

Supposing the SDK is installed in the `<vechain-sdk-js>` directory,
the file at `<vechain-sdk-js/package.json` shows in the `scripts` tag the **docker compose** files the
two commands `start-thor-solo` and `stop-thor-solo` invoke.

This is the way to start and stop **solo** suggested to follow the next lessons.

## What an 'account' is?

In Thor terminology, an external owned account is a relation between an address - created because a pair of keys
owned by a user - and funds.
An account is created first when a
[transaction is written](https://docs.vechain.org/developer-resources/how-to-build-on-vechain/write-data/transactions)
in the blockchain.

But what happens when a Thor network bootstraps for the first time, when nothing exists yet in the blockchain?
When nothing exists yet, everything is still possible.

## Bootstrapping Thor 'solo'

The first block of the blockchain is called **genesis** block and has address `0`.
When Thor bootstraps and the genesis block doesn't exist in the blockchain nor instructions are received by
peers node to synchronize the blockchain, the node checks if launched with the
`--genesis` option as explained in
[How to run a Thor solo node]()https://docs.vechain.org/how-to-run-a-node/how-to-run-a-thor-solo-node.
This `--genesis` options points to a JSON structured file where the - so called - primordial accounts are defined
associating addresses and their attributes, like
**balance** in [VET](https://docs.vechain.org/introduction-to-vechain/dual-token-economic-model/vechain-vet) and
**energy** in [VTHO](https://docs.vechain.org/introduction-to-vechain/dual-token-economic-model/vethor-vtho).

How to [configure your genesis file](https://docs.vechain.org/how-to-run-a-node/custom-network#configure-your-genesis-file)
describes the structure of the **genesis** file.

Supposing the SDK is installed in the `<vechain-sdk-js>` directory,
the file at `<vechain-sdk-js>/docker-compose.rpc-proxy.yml` shows how **docker compose** bootstraps **solo**
with the `--gensis` option reading how to build the genesis block from the file at
`<vechain-sdk-js>/docker/rpc-proxy/config/genesis.json`.

The file at `<vechain-sdk-js>/docker-compose.thor.yml` is what `yarn start-thor-solo` invokes, the launched
**solo** instance has ten full funded accounts.

In the following lessons of this tutorial you will play with these primordial accounts and you will transfer **balance**
and **energy** funds from them to the accounts you will create.

