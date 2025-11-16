import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI, NETWORK_CONFIG } from '../config/contract-config'

// Connect wallet
export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask!')
  }
  
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  })
  
  const chainId = await window.ethereum.request({
    method: 'eth_chainId'
  })
  
  if (chainId !== NETWORK_CONFIG.chainId) {
    await switchToMoonbase()
  }
  
  return accounts[0]
}

async function switchToMoonbase() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: NETWORK_CONFIG.chainId }]
    })
  } catch (error) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [NETWORK_CONFIG]
      })
    }
  }
}

function getContract(needsSigner = false) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  if (needsSigner) {
    const signer = provider.getSigner()
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
  }
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
}

// Upload dataset to blockchain
export async function uploadDataset(cid, analysisCID, isPublic, isPrivate, isPaid, price) {
  const contract = getContract(true)
  const priceInWei = isPaid ? ethers.utils.parseEther(price.toString()) : 0
  
  const tx = await contract.uploadDataset(
    cid,
    analysisCID,
    isPublic,
    isPrivate,
    isPaid,
    priceInWei
  )
  
  await tx.wait()
  return tx.hash
}

// Get public datasets (paginated)
export async function getPublicDatasets(start = 0, limit = 10) {
  const contract = getContract(false)
  const [datasets, nextStart] = await contract.getPublicDatasetPage(start, limit)
  
  return datasets.map(d => ({
    datasetCID: d.datasetCID,
    analysisCID: d.analysisCID,
    uploader: d.uploader,
    isPublic: d.isPublic,
    isPrivate: d.isPrivate,
    timestamp: d.timestamp.toNumber(),
    views: d.views.toNumber(),
    downloads: d.downloads.toNumber(),
    isPaid: d.isPaid,
    price: ethers.utils.formatEther(d.priceInFIL),
    earnings: ethers.utils.formatEther(d.earnings)
  }))
}

// Get user's uploaded datasets
export async function getMyDatasets() {
  const contract = getContract(false)
  const ids = await contract.getMyDatasetIds()
  
  const datasets = []
  for (const id of ids) {
    const d = await contract.getDataset(id)
    datasets.push({
      id: id.toNumber(),
      datasetCID: d.datasetCID,
      analysisCID: d.analysisCID,
      uploader: d.uploader,
      isPublic: d.isPublic,
      isPrivate: d.isPrivate,
      timestamp: d.timestamp.toNumber(),
      views: d.views.toNumber(),
      downloads: d.downloads.toNumber(),
      isPaid: d.isPaid,
      price: ethers.utils.formatEther(d.priceInFIL),
      earnings: ethers.utils.formatEther(d.earnings)
    })
  }
  
  return datasets
}

// Get purchased datasets
export async function getMyPurchases() {
  const contract = getContract(false)
  const ids = await contract.getMyPurchasedIds()
  
  const datasets = []
  for (const id of ids) {
    const d = await contract.getDataset(id)
    datasets.push({
      id: id.toNumber(),
      datasetCID: d.datasetCID,
      analysisCID: d.analysisCID,
      uploader: d.uploader,
      timestamp: d.timestamp.toNumber(),
      price: ethers.utils.formatEther(d.priceInFIL)
    })
  }
  
  return datasets
}

// Purchase dataset
export async function purchaseDataset(id, tokenAddress) {
  const contract = getContract(true)
  const tx = await contract.purchaseDataset(id, tokenAddress)
  await tx.wait()
  return tx.hash
}

// Increment views
export async function incrementViews(id) {
  const contract = getContract(true)
  const tx = await contract.incrementViews(id)
  await tx.wait()
}

// Get earnings
export async function getMyEarnings() {
  const contract = getContract(false)
  const earnings = await contract.getMyEarnings()
  return ethers.utils.formatEther(earnings)
}

// Get total datasets
export async function getTotalDatasets() {
  const contract = getContract(false)
  const total = await contract.totalDatasets()
  return total.toNumber()
}