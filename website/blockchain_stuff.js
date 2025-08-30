const NETWORK_ID = 412346

const MY_CONTRACT_ADDRESS = "0xYOUR_CONTRACT_HERE"

const MY_CONTRACT_ABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "color", "type": "uint256" }],
    "name": "getSwordCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "color", "type": "uint256" }],
    "name": "incrementSword",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

var my_contract
var accounts
var web3

function metamaskReloadCallback() {
  window.ethereum.on('accountsChanged', () => {
    document.getElementById("web3_message").textContent="Account changed, refreshing...";
    window.location.reload()
  })
  window.ethereum.on('chainChanged', () => {
    document.getElementById("web3_message").textContent="Network changed, refreshing...";
    window.location.reload()
  })
}

const getWeb3 = async () => {
  return new Promise((resolve, reject) => {
    if(document.readyState=="complete") {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum)
        resolve(web3)
      } else {
        reject("must install MetaMask")
        document.getElementById("web3_message").textContent="Error: Please install Metamask";
      }
    } else {
      window.addEventListener("load", async () => {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum)
          resolve(web3)
        } else {
          reject("must install MetaMask")
          document.getElementById("web3_message").textContent="Error: Please install Metamask";
        }
      });
    }
  });
};

const getContract = async (web3, address, abi) => {
  return new web3.eth.Contract(abi, address)
}

async function loadDapp() {
  metamaskReloadCallback()
  document.getElementById("web3_message").textContent="Please connect to Metamask"

  web3 = await getWeb3()
  web3.eth.net.getId((err, netId) => {
    if (netId == NETWORK_ID) {
      (async function() {
        my_contract = await getContract(web3, MY_CONTRACT_ADDRESS, MY_CONTRACT_ABI)
        document.getElementById("web3_message").textContent="Connected to Metamask"
        onContractInitCallback()
        web3.eth.getAccounts(function(err, _accounts){
          accounts = _accounts
          if (err != null) {
            console.error("An error occurred: "+err)
          } else if (accounts.length > 0) {
            onWalletConnectedCallback()
            document.getElementById("account_address").style.display = "block"
          } else {
            document.getElementById("connect_button").style.display = "block"
          }
        });
      })()
    } else {
      document.getElementById("web3_message").textContent="Please connect to Goerli";
    }
  });
}

async function connectWallet() {
  await window.ethereum.request({ method: "eth_requestAccounts" })
  accounts = await web3.eth.getAccounts()
  onWalletConnectedCallback()
}

loadDapp()

const onContractInitCallback = async () => {
  let red = await my_contract.methods.getSwordCount(0).call()
  let blue = await my_contract.methods.getSwordCount(1).call()
  let green = await my_contract.methods.getSwordCount(2).call()

  let contract_state = 
    "Red Swords: " + red +
    ", Blue Swords: " + blue +
    ", Green Swords: " + green

  document.getElementById("contract_state").textContent = contract_state;
}

const onWalletConnectedCallback = async () => {}

const incrementSword = async (color) => {
  const result = await my_contract.methods.incrementSword(color)
    .send({ from: accounts[0], gas: 0, value: 0 })
    .on('transactionHash', function(hash){
      document.getElementById("web3_message").textContent="Executing...";
    })
    .on('receipt', function(receipt){
      document.getElementById("web3_message").textContent="Success.";
      onContractInitCallback() // refresh sword counts
    })
    .catch((revertReason) => {
      console.log("ERROR! Transaction reverted: " + revertReason.receipt.transactionHash)
    });
}
