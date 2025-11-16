/**
 * Arkiv SDK Integration
 * Arkiv is a state-of-the-art, Ethereum-based, cost-efficient data layer
 * This module implements CRUD operations, TTL, subscriptions, and queries
 */

// Arkiv API configuration
const ARKIV_API_URL = process.env.ARKIV_API_URL || 'https://api.arkiv.org' // Update with actual Arkiv API URL
const ARKIV_NETWORK = process.env.ARKIV_NETWORK || 'ethereum' // or 'polygon', etc.

/**
 * Initialize Arkiv client
 * Requires wallet connection for authentication
 */
export async function initArkivClient(walletAddress, signer) {
  if (!window.ethereum || !walletAddress) {
    throw new Error('Wallet not connected')
  }

  // Arkiv client initialization
  // This would typically use the Arkiv SDK
  // For now, we'll create a client object that can be extended
  const client = {
    address: walletAddress,
    signer: signer,
    network: ARKIV_NETWORK,
    apiUrl: ARKIV_API_URL
  }

  return client
}

/**
 * CREATE: Upload file to Arkiv
 * Returns the CID (Content Identifier) for the uploaded file
 */
export async function uploadToArkiv(file, client, options = {}) {
  try {
    if (!client || !client.address) {
      throw new Error('Arkiv client not initialized')
    }

    // Prepare file data
    const formData = new FormData()
    formData.append('file', file)
    formData.append('address', client.address)

    // Add optional metadata
    if (options.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata))
    }

    // Add TTL (Time To Live) if specified
    if (options.ttl) {
      formData.append('ttl', options.ttl.toString())
    }

    // Sign message for authentication (Arkiv uses EIP-712 signing)
    const message = {
      domain: {
        name: 'Arkiv',
        version: '1',
        chainId: await client.signer.getChainId(),
        verifyingContract: ARKIV_API_URL
      },
      message: {
        action: 'upload',
        file: file.name,
        timestamp: Date.now()
      },
      primaryType: 'Upload',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' }
        ],
        Upload: [
          { name: 'action', type: 'string' },
          { name: 'file', type: 'string' },
          { name: 'timestamp', type: 'uint256' }
        ]
      }
    }

    // Sign the message using ethers utils
    // Note: _signTypedData is a private method, we'll use a workaround
    let signature
    try {
      // Try using the signer's _signTypedData if available
      if (client.signer._signTypedData) {
        signature = await client.signer._signTypedData(
          message.domain,
          message.types,
          message.message
        )
      } else {
        // Fallback: use personal_sign for now (Arkiv may accept this)
        const messageToSign = JSON.stringify(message.message)
        signature = await client.signer.signMessage(messageToSign)
      }
    } catch (signError) {
      // If signing fails, use a simple message signature
      const fileName = file?.name || 'file'
      const messageToSign = `Arkiv Upload: ${fileName} at ${Date.now()}`
      signature = await client.signer.signMessage(messageToSign)
    }

    // Upload to Arkiv
    const response = await fetch(`${ARKIV_API_URL}/v1/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${signature}`,
        'X-Address': client.address
      },
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to upload to Arkiv')
    }

    const data = await response.json()
    return data.cid // Return the CID
  } catch (error) {
    console.error('Arkiv upload error:', error)
    throw new Error(`Failed to upload to Arkiv: ${error.message}`)
  }
}

/**
 * READ: Retrieve file from Arkiv by CID
 */
export async function readFromArkiv(cid, client) {
  try {
    if (!client || !client.address) {
      throw new Error('Arkiv client not initialized')
    }

    const response = await fetch(`${ARKIV_API_URL}/v1/read/${cid}`, {
      method: 'GET',
      headers: {
        'X-Address': client.address
      }
    })

    if (!response.ok) {
      throw new Error('Failed to read from Arkiv')
    }

    return await response.blob() // Return file blob
  } catch (error) {
    console.error('Arkiv read error:', error)
    throw error
  }
}

/**
 * UPDATE: Update metadata for an existing file in Arkiv
 */
export async function updateArkivMetadata(cid, metadata, client) {
  try {
    if (!client || !client.address) {
      throw new Error('Arkiv client not initialized')
    }

    // Sign update message
    const message = {
      domain: {
        name: 'Arkiv',
        version: '1',
        chainId: await client.signer.getChainId(),
        verifyingContract: ARKIV_API_URL
      },
      message: {
        action: 'update',
        cid: cid,
        metadata: JSON.stringify(metadata),
        timestamp: Date.now()
      },
      primaryType: 'Update',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' }
        ],
        Update: [
          { name: 'action', type: 'string' },
          { name: 'cid', type: 'string' },
          { name: 'metadata', type: 'string' },
          { name: 'timestamp', type: 'uint256' }
        ]
      }
    }

    const signature = await client.signer._signTypedData(
      message.domain,
      message.types,
      message.message
    )

    const response = await fetch(`${ARKIV_API_URL}/v1/update/${cid}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${signature}`,
        'X-Address': client.address,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ metadata })
    })

    if (!response.ok) {
      throw new Error('Failed to update Arkiv metadata')
    }

    return await response.json()
  } catch (error) {
    console.error('Arkiv update error:', error)
    throw error
  }
}

/**
 * DELETE: Remove file from Arkiv
 */
export async function deleteFromArkiv(cid, client) {
  try {
    if (!client || !client.address) {
      throw new Error('Arkiv client not initialized')
    }

    // Sign delete message
    const message = {
      domain: {
        name: 'Arkiv',
        version: '1',
        chainId: await client.signer.getChainId(),
        verifyingContract: ARKIV_API_URL
      },
      message: {
        action: 'delete',
        cid: cid,
        timestamp: Date.now()
      },
      primaryType: 'Delete',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' }
        ],
        Delete: [
          { name: 'action', type: 'string' },
          { name: 'cid', type: 'string' },
          { name: 'timestamp', type: 'uint256' }
        ]
      }
    }

    const signature = await client.signer._signTypedData(
      message.domain,
      message.types,
      message.message
    )

    const response = await fetch(`${ARKIV_API_URL}/v1/delete/${cid}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${signature}`,
        'X-Address': client.address
      }
    })

    if (!response.ok) {
      throw new Error('Failed to delete from Arkiv')
    }

    return await response.json()
  } catch (error) {
    console.error('Arkiv delete error:', error)
    throw error
  }
}

/**
 * QUERY: Query files in Arkiv with filters
 */
export async function queryArkiv(query, client) {
  try {
    if (!client || !client.address) {
      throw new Error('Arkiv client not initialized')
    }

    const response = await fetch(`${ARKIV_API_URL}/v1/query`, {
      method: 'POST',
      headers: {
        'X-Address': client.address,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query)
    })

    if (!response.ok) {
      throw new Error('Failed to query Arkiv')
    }

    return await response.json()
  } catch (error) {
    console.error('Arkiv query error:', error)
    throw error
  }
}

/**
 * SUBSCRIPTION: Subscribe to updates for a CID
 */
export async function subscribeToArkiv(cid, callback, client) {
  try {
    if (!client || !client.address) {
      throw new Error('Arkiv client not initialized')
    }

    // Use WebSocket or Server-Sent Events for real-time updates
    const ws = new WebSocket(`${ARKIV_API_URL.replace('http', 'ws')}/v1/subscribe/${cid}`)

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      callback(data)
    }

    ws.onerror = (error) => {
      console.error('Arkiv subscription error:', error)
    }

    return () => ws.close() // Return unsubscribe function
  } catch (error) {
    console.error('Arkiv subscription error:', error)
    throw error
  }
}

/**
 * TTL: Set Time To Live for a file
 */
export async function setArkivTTL(cid, ttlSeconds, client) {
  try {
    if (!client || !client.address) {
      throw new Error('Arkiv client not initialized')
    }

    const message = {
      domain: {
        name: 'Arkiv',
        version: '1',
        chainId: await client.signer.getChainId(),
        verifyingContract: ARKIV_API_URL
      },
      message: {
        action: 'setTTL',
        cid: cid,
        ttl: ttlSeconds,
        timestamp: Date.now()
      },
      primaryType: 'SetTTL',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' }
        ],
        SetTTL: [
          { name: 'action', type: 'string' },
          { name: 'cid', type: 'string' },
          { name: 'ttl', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' }
        ]
      }
    }

    const signature = await client.signer._signTypedData(
      message.domain,
      message.types,
      message.message
    )

    const response = await fetch(`${ARKIV_API_URL}/v1/ttl/${cid}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${signature}`,
        'X-Address': client.address,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ttl: ttlSeconds })
    })

    if (!response.ok) {
      throw new Error('Failed to set TTL')
    }

    return await response.json()
  } catch (error) {
    console.error('Arkiv TTL error:', error)
    throw error
  }
}

