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


[How to run a Thor solo node](https://docs.vechain.org/how-to-run-a-node/how-to-run-a-thor-solo-node)

The most convenient way to run a **solo** node network is to run it in a
**[docker](https://docs.vechain.org/how-to-run-a-node/how-to-run-a-thor-solo-node#docker-containerized-convenience)**
container.

The following guides shows how to install
 - **[docker](https://docs.docker.com/get-started/get-docker/)**
   and **[docker compose](https://docs.docker.com/compose/install/)**, or
 - **[docker desktop](https://docs.docker.com/desktop/)**
in your computer.

Once **docker** and **docker compose** or **docker desktop** - that includes **docker compose** - are installed,

1. move to the directory of the SDK.
2. To start **solo** open the [CLI](https://en.wikipedia.org/wiki/Command-line_interface) shell and type
   ```shell
   docker compose -f docker-compose.thor.yml up -d --wait
   ```
3. To stop **solo**, type in shell
   ```shell
   docker compose -f docker-compose.thor.yml down
   ```

Since you are reading this tutorial, there are excellent chances you read it to develop software with the help of the
SDK, hence you have already installed
- [Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)

you can start **solo** typing in the shell

```shell
yarn start start-thor-solo
```

and stop it later typing in the shell

```shell
yarn stop-thor-solo 
```



