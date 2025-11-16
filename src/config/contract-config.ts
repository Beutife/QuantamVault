// Deployed Contract Address (PAS Testnet)
export const CONTRACT_ADDRESS = "0xc8F6fF01fd1D981e627a8102fc334D360Af7384b"

// Polkadot Hub TestNet Network Config
export const NETWORK_CONFIG = {
  chainId: '0x1910A6E6', // 420420422 in hex
  chainName: 'Polkadot Hub TestNet',
  nativeCurrency: {
    name: 'DOT',
    symbol: 'DOT',
    decimals: 18
  },
  rpcUrls: ['https://testnet-passet-hub-eth-rpc.polkadot.io'],
  blockExplorerUrls: ['https://polkadot-hub-testnet.subscan.io/']
}

// Contract ABI (from Remix - paste the FULL ABI here)
export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "publisher",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "amount",
        "type": "uint128"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "DatasetPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "uploader",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isPublic",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isPaid",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "price",
        "type": "uint128"
      }
    ],
    "name": "DatasetUploaded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "uploader",
        "type": "address"
      }
    ],
    "name": "PublicDatasetListed",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "acceptedTokenCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "acceptedTokenByIndex",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "addPaymentToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "getDataset",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "datasetCID",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "analysisCID",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "uploader",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isPublic",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isPrivate",
            "type": "bool"
          },
          {
            "internalType": "uint48",
            "name": "timestamp",
            "type": "uint48"
          },
          {
            "internalType": "uint48",
            "name": "views",
            "type": "uint48"
          },
          {
            "internalType": "uint48",
            "name": "downloads",
            "type": "uint48"
          },
          {
            "internalType": "bool",
            "name": "isPaid",
            "type": "bool"
          },
          {
            "internalType": "uint128",
            "name": "priceInFIL",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "earnings",
            "type": "uint128"
          }
        ],
        "internalType": "struct QuantumAi.Dataset",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "getDatasetEarnings",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyDatasetIds",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyEarnings",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyPurchasedIds",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "start",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "limit",
        "type": "uint256"
      }
    ],
    "name": "getPublicDatasetPage",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "datasetCID",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "analysisCID",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "uploader",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isPublic",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "isPrivate",
            "type": "bool"
          },
          {
            "internalType": "uint48",
            "name": "timestamp",
            "type": "uint48"
          },
          {
            "internalType": "uint48",
            "name": "views",
            "type": "uint48"
          },
          {
            "internalType": "uint48",
            "name": "downloads",
            "type": "uint48"
          },
          {
            "internalType": "bool",
            "name": "isPaid",
            "type": "bool"
          },
          {
            "internalType": "uint128",
            "name": "priceInFIL",
            "type": "uint128"
          },
          {
            "internalType": "uint128",
            "name": "earnings",
            "type": "uint128"
          }
        ],
        "internalType": "struct QuantumAi.Dataset[]",
        "name": "page",
        "type": "tuple[]"
      },
      {
        "internalType": "uint256",
        "name": "nextStart",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "incrementDownloads",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "incrementViews",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "paymentTokens",
    "outputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isAccepted",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "purchaseDataset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalDatasets",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_cid",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_analysis",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "_public",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "_private",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "_paid",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      }
    ],
    "name": "uploadDataset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]