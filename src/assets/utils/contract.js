import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI, NETWORK_CONFIG } from '../../config/contract-config'

// Validate contract address
function isValidContractAddress(address) {
  if (!address || typeof address !== 'string') {
    return false
  }
  // Check if it's a placeholder
  if (address.includes('YOUR_CONTRACT') || address.includes('0xYOUR') || address === '') {
    return false
  }
  // Check if it's a valid Ethereum address format
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// Check if contract is configured
export function isContractConfigured() {
  return isValidContractAddress(CONTRACT_ADDRESS)
}

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
    await switchToCorrectNetwork()
  }
  
  return accounts[0]
}

async function switchToCorrectNetwork() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: NETWORK_CONFIG.chainId }]
    })
  } catch (error) {
    if (error.code === 4902) {
      // Chain not added to MetaMask, add it
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [NETWORK_CONFIG]
      })
    } else {
      throw error
    }
  }
}

function getContract(needsSigner = false) {
  if (!isContractConfigured()) {
    throw new Error('Contract address not configured. Please set CONTRACT_ADDRESS in src/config/contract-config.ts')
  }
  
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed or not connected')
  }
  
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  
  // Validate address before creating contract
  if (!ethers.utils.isAddress(CONTRACT_ADDRESS)) {
    throw new Error(`Invalid contract address: ${CONTRACT_ADDRESS}. Please set a valid Ethereum address in src/config/contract-config.ts`)
  }
  
  if (needsSigner) {
    const signer = provider.getSigner()
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
  }
  
  // For view functions, try with provider first
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
  
  // Verify contract has code at this address
  provider.getCode(CONTRACT_ADDRESS).then(code => {
    if (code === '0x' || code === '0x0') {
      console.error('❌ No contract code found at address:', CONTRACT_ADDRESS)
      console.error('This means the contract is not deployed at this address on the current network.')
      console.error('Please verify:')
      console.error('1. The contract address is correct for this network')
      console.error('2. The contract is deployed on the network you are connected to')
      console.error('3. You are connected to the correct network')
    } else {
      console.log('✓ Contract code found at address:', CONTRACT_ADDRESS)
      console.log('Contract code length:', code.length, 'characters')
    }
  }).catch(err => {
    console.error('Error checking contract code:', err)
  })
  
  return contract
}

// Upload dataset to blockchain
export async function uploadDataset(cid, analysisCID, isPublic, isPrivate, isPaid, price) {
  const contract = getContract(true)
  const priceInWei = isPaid ? ethers.utils.parseEther(price.toString()) : 0
  
  console.log('Uploading dataset with params:', { cid, analysisCID, isPublic, isPrivate, isPaid, price: priceInWei.toString() })
  
  const tx = await contract.uploadDataset(
    cid,
    analysisCID,
    isPublic,
    isPrivate,
    isPaid,
    priceInWei
  )
  
  console.log('Upload transaction sent:', tx.hash)
  const receipt = await tx.wait()
  console.log('Upload transaction confirmed in block:', receipt.blockNumber)
  
  // Return both hash and block number for tracking
  return { hash: tx.hash, blockNumber: receipt.blockNumber }
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
  try {
    // Verify network first
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const network = await provider.getNetwork()
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    console.log('Current network chainId:', chainId, 'Expected:', NETWORK_CONFIG.chainId)
    console.log('Network name:', network.name, 'chainId:', network.chainId.toString())
    
    if (chainId !== NETWORK_CONFIG.chainId) {
      console.warn('⚠️ Network mismatch! Expected:', NETWORK_CONFIG.chainId, 'Got:', chainId)
    }
    
    // Get the user's address from the signer first
    let userAddress
    try {
      const signer = provider.getSigner()
      userAddress = await signer.getAddress()
      console.log('User address:', userAddress)
    } catch (error) {
      console.error('Error getting user address:', error)
      throw new Error('Please connect your wallet')
    }
    
    // Always use signer for contract calls since getDataset has canView modifier
    const contract = getContract(true)
    const contractNoSigner = getContract(false) // For totalDatasets which doesn't need signer
    
    // Try to use getMyDatasetIds first
    let ids = []
    let useFallback = false
    try {
      console.log('Trying getMyDatasetIds()...')
      ids = await contract.getMyDatasetIds()
      console.log('Dataset IDs received from getMyDatasetIds:', ids, 'Type:', typeof ids, 'Length:', ids?.length)
      
      // Convert BigNumber array to numbers
      if (ids && ids.length > 0) {
        ids = ids.map(id => {
          if (id && typeof id === 'object' && id.toNumber) {
            return id.toNumber()
          }
          return parseInt(id.toString())
        })
        console.log('Converted IDs to numbers:', ids)
      } else {
        console.log('getMyDatasetIds() returned empty array, trying fallback scan to verify...')
        useFallback = true
      }
    } catch (error) {
      console.log('getMyDatasetIds() failed with error, falling back to scanning all datasets:', error.message)
      useFallback = true
    }
    
    // Use fallback if getMyDatasetIds failed or returned empty
    if (useFallback) {
      
      // Fallback: Get total datasets and scan through them
      try {
        console.log('Attempting to call totalDatasets()...')
        let total
        try {
          // Try with provider first
          total = await contractNoSigner.totalDatasets()
        } catch (providerError) {
          console.log('totalDatasets() with provider failed, trying with signer...', providerError.message)
          // Try with signer as fallback
          total = await contract.totalDatasets()
        }
        
        const totalNum = total.toNumber ? total.toNumber() : parseInt(total.toString())
        console.log('Total datasets in contract:', totalNum)
        
        if (totalNum === 0) {
          console.log('No datasets in contract yet')
          return []
        }
        
        // Scan through all datasets and filter by uploader
        // We need to use signer for getDataset because of canView modifier
        console.log(`Scanning ${totalNum} datasets for uploader: ${userAddress}`)
        for (let i = 0; i < totalNum; i++) {
          try {
            // Use signer so canView modifier can check msg.sender
            const d = await contract.getDataset(i)
            console.log(`Dataset ${i} uploader: ${d.uploader}, isPublic: ${d.isPublic}, isPrivate: ${d.isPrivate}`)
            
            // Check if we're the uploader
            if (d.uploader && d.uploader.toLowerCase() === userAddress.toLowerCase()) {
              ids.push(i)
              console.log(`✓ Found your dataset at ID: ${i}`)
            }
          } catch (err) {
            // This is expected for datasets we can't view (not ours and not public)
            // Only log if it's not a "No view" error
            if (!err.message || (!err.message.includes('No view') && !err.message.includes('revert'))) {
              console.log(`Error checking dataset ${i}:`, err.message)
            }
            // Continue scanning
          }
        }
        console.log('Final dataset IDs found by scanning:', ids)
      } catch (scanError) {
        console.error('Error scanning datasets:', scanError)
        // Don't throw - return empty array instead
        return []
      }
    }
    
    if (!ids || ids.length === 0) {
      console.log('No datasets found for this user')
      return []
    }
    
    const datasets = []
    for (let i = 0; i < ids.length; i++) {
      try {
        const idNum = ids[i]
        console.log(`Fetching dataset ${i + 1}/${ids.length} with ID:`, idNum)
        // Use signer for getDataset (required by canView modifier)
        const d = await contract.getDataset(idNum)
        console.log('Dataset data:', d)
        
        datasets.push({
          id: idNum,
          datasetCID: d.datasetCID,
          analysisCID: d.analysisCID,
          uploader: d.uploader,
          isPublic: d.isPublic,
          isPrivate: d.isPrivate,
          timestamp: d.timestamp ? (d.timestamp.toNumber ? d.timestamp.toNumber() : parseInt(d.timestamp.toString())) : Date.now(),
          views: d.views ? (d.views.toNumber ? d.views.toNumber() : parseInt(d.views.toString())) : 0,
          downloads: d.downloads ? (d.downloads.toNumber ? d.downloads.toNumber() : parseInt(d.downloads.toString())) : 0,
          isPaid: d.isPaid,
          price: d.priceInFIL ? ethers.utils.formatEther(d.priceInFIL) : '0',
          earnings: d.earnings ? ethers.utils.formatEther(d.earnings) : '0'
        })
      } catch (error) {
        console.error(`Error fetching dataset ${ids[i]}:`, error)
        // Continue with other datasets even if one fails
      }
    }
    
    console.log('Final datasets array:', datasets)
    return datasets
  } catch (error) {
    console.error('Error in getMyDatasets:', error)
    throw error
  }
}

// Get purchased datasets
export async function getMyPurchases() {
  // Use signer because getMyPurchasedIds() uses msg.sender
  const contract = getContract(true)
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
  // Use signer because getMyEarnings() uses msg.sender
  const contract = getContract(true)
  const earnings = await contract.getMyEarnings()
  return ethers.utils.formatEther(earnings)
}

// Get total datasets
export async function getTotalDatasets() {
  const contract = getContract(false)
  const total = await contract.totalDatasets()
  return total.toNumber()
}