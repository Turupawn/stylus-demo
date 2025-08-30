

**1. Lanzá el contrato**

Primero instalá rust.

```bash
# install rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup toolchain install nightly
```

Luego la stylus crate.

```bash
# install stylus
cargo install --force cargo-stylus
rustup default 1.80
rustup target add wasm32-unknown-unknown --toolchain 1.80
```

Ahora core el dev-node.

```bash
git clone https://github.com/OffchainLabs/nitro-devnode.git
cd nitro-devnode
sh run-dev-node.sh
```

Now deploy the contracts

```bash
cd contracts
cargo stylus deploy   --endpoint='http://localhost:8547'   --private-key="0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659" --no-verify
```

Vas a ver el address del contrato en la consola en:

```bash
deployed code at address: 0x525c2aba45f66987217323e8a05ea400c65d06dc
```

Guardá el contrató, lo vamos a ocupar luego.

**2. Corré el juego**

Copypasteá `game/.env_example` en `game/.env` y agregá el address de tu contrato. Por ejemplo:

```bash
RPC_URL = http://localhost:8547
PRIVATE_KEY = 0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659
STYLUS_CONTRACT_ADDRESS = 0x525c2aba45f66987217323e8a05ea400c65d06dc
```

Corré el juego.

```bash
cd game
cargo run
```


**3. Corré la webapp**

Instalá un servidor web, te recomiendo lite-server.

```
npm install lite-server
```

Corré el frontend.

```bash
cd webapp
lite-server
```

Conectá tu wallet a Nitro local.

* RPC Url: `http://localhost:8547`
* Chain id: `412346`
* Symbol: `ETH`

Y agrega la private key con fondos:

`0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659`

Ahora estás listo para interactuar con el contrato en ambos el juego y la webapp.