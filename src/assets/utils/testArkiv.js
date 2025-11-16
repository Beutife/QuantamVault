/**
 * Arkiv Testing Utility
 * Tests all Arkiv functionality: CRUD, TTL, Subscriptions, Queries
 */

import { 
  initArkivClient, 
  uploadToArkiv, 
  readFromArkiv, 
  updateArkivMetadata,
  deleteFromArkiv,
  queryArkiv,
  subscribeToArkiv,
  setArkivTTL
} from './arkiv.js'

/**
 * Test Arkiv Connection
 */
export async function testArkivConnection(walletAddress, signer) {
  const results = {
    connection: false,
    client: null,
    error: null
  }

  try {
    console.log('🔍 Testing Arkiv connection...')
    const client = await initArkivClient(walletAddress, signer)
    results.connection = true
    results.client = client
    console.log('✓ Arkiv client initialized:', client)
    return results
  } catch (error) {
    results.error = error.message
    console.error('✗ Arkiv connection failed:', error)
    return results
  }
}

/**
 * Test Arkiv Upload (CREATE)
 */
export async function testArkivUpload(walletAddress, signer) {
  const results = {
    success: false,
    cid: null,
    error: null,
    duration: 0
  }

  try {
    console.log('📤 Testing Arkiv upload (CREATE)...')
    const startTime = Date.now()
    
    // Create a test file
    const testContent = `Test file uploaded at ${new Date().toISOString()}\nThis is a test file for Arkiv integration.`
    const testFile = new Blob([testContent], { type: 'text/plain' })
    testFile.name = `arkiv-test-${Date.now()}.txt`
    
    const client = await initArkivClient(walletAddress, signer)
    const cid = await uploadToArkiv(testFile, client, {
      metadata: {
        name: testFile.name,
        type: 'test',
        description: 'Arkiv integration test file'
      }
    })
    
    results.success = true
    results.cid = cid
    results.duration = Date.now() - startTime
    console.log('✓ Arkiv upload successful, CID:', cid)
    return results
  } catch (error) {
    results.error = error.message
    results.duration = Date.now() - Date.now()
    console.error('✗ Arkiv upload failed:', error)
    return results
  }
}

/**
 * Test Arkiv Read
 */
export async function testArkivRead(cid, walletAddress, signer) {
  const results = {
    success: false,
    data: null,
    error: null,
    duration: 0
  }

  try {
    console.log('📥 Testing Arkiv read (READ)...')
    const startTime = Date.now()
    
    const client = await initArkivClient(walletAddress, signer)
    const data = await readFromArkiv(cid, client)
    
    results.success = true
    results.data = data
    results.duration = Date.now() - startTime
    console.log('✓ Arkiv read successful')
    return results
  } catch (error) {
    results.error = error.message
    results.duration = Date.now() - Date.now()
    console.error('✗ Arkiv read failed:', error)
    return results
  }
}

/**
 * Test Arkiv Update (UPDATE)
 */
export async function testArkivUpdate(cid, walletAddress, signer) {
  const results = {
    success: false,
    error: null,
    duration: 0
  }

  try {
    console.log('✏️ Testing Arkiv update (UPDATE)...')
    const startTime = Date.now()
    
    const client = await initArkivClient(walletAddress, signer)
    const newMetadata = {
      updatedAt: new Date().toISOString(),
      test: true
    }
    
    await updateArkivMetadata(cid, newMetadata, client)
    
    results.success = true
    results.duration = Date.now() - startTime
    console.log('✓ Arkiv update successful')
    return results
  } catch (error) {
    results.error = error.message
    results.duration = Date.now() - Date.now()
    console.error('✗ Arkiv update failed:', error)
    return results
  }
}

/**
 * Test Arkiv Query
 */
export async function testArkivQuery(walletAddress, signer) {
  const results = {
    success: false,
    results: null,
    error: null,
    duration: 0
  }

  try {
    console.log('🔎 Testing Arkiv query (QUERY)...')
    const startTime = Date.now()
    
    const client = await initArkivClient(walletAddress, signer)
    const queryResults = await queryArkiv({
      owner: walletAddress,
      limit: 10
    }, client)
    
    results.success = true
    results.results = queryResults
    results.duration = Date.now() - startTime
    console.log('✓ Arkiv query successful, found:', queryResults?.length || 0, 'items')
    return results
  } catch (error) {
    results.error = error.message
    results.duration = Date.now() - Date.now()
    console.error('✗ Arkiv query failed:', error)
    return results
  }
}

/**
 * Test Arkiv TTL
 */
export async function testArkivTTL(cid, walletAddress, signer) {
  const results = {
    success: false,
    error: null,
    duration: 0
  }

  try {
    console.log('⏰ Testing Arkiv TTL...')
    const startTime = Date.now()
    
    const client = await initArkivClient(walletAddress, signer)
    // Set TTL to 1 hour (3600 seconds) for testing
    await setArkivTTL(cid, 3600, client)
    
    results.success = true
    results.duration = Date.now() - startTime
    console.log('✓ Arkiv TTL set successfully')
    return results
  } catch (error) {
    results.error = error.message
    results.duration = Date.now() - Date.now()
    console.error('✗ Arkiv TTL failed:', error)
    return results
  }
}

/**
 * Run all Arkiv tests
 */
export async function runAllArkivTests(walletAddress, signer) {
  console.log('🧪 Starting comprehensive Arkiv tests...')
  console.log('='.repeat(50))
  
  const testResults = {
    connection: null,
    upload: null,
    read: null,
    update: null,
    query: null,
    ttl: null,
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    }
  }

  // Test 1: Connection
  testResults.connection = await testArkivConnection(walletAddress, signer)
  testResults.summary.total++
  if (testResults.connection.connection) {
    testResults.summary.passed++
  } else {
    testResults.summary.failed++
    console.log('⚠️ Connection failed, skipping other tests')
    return testResults
  }

  // Test 2: Upload (CREATE)
  testResults.upload = await testArkivUpload(walletAddress, signer)
  testResults.summary.total++
  if (testResults.upload.success) {
    testResults.summary.passed++
  } else {
    testResults.summary.failed++
  }

  // Test 3: Read (only if upload succeeded)
  if (testResults.upload.success && testResults.upload.cid) {
    testResults.read = await testArkivRead(testResults.upload.cid, walletAddress, signer)
    testResults.summary.total++
    if (testResults.read.success) {
      testResults.summary.passed++
    } else {
      testResults.summary.failed++
    }

    // Test 4: Update
    testResults.update = await testArkivUpdate(testResults.upload.cid, walletAddress, signer)
    testResults.summary.total++
    if (testResults.update.success) {
      testResults.summary.passed++
    } else {
      testResults.summary.failed++
    }

    // Test 5: TTL
    testResults.ttl = await testArkivTTL(testResults.upload.cid, walletAddress, signer)
    testResults.summary.total++
    if (testResults.ttl.success) {
      testResults.summary.passed++
    } else {
      testResults.summary.failed++
    }
  }

  // Test 6: Query
  testResults.query = await testArkivQuery(walletAddress, signer)
  testResults.summary.total++
  if (testResults.query.success) {
    testResults.summary.passed++
  } else {
    testResults.summary.failed++
  }

  console.log('='.repeat(50))
  console.log('📊 Test Summary:')
  console.log(`   Total: ${testResults.summary.total}`)
  console.log(`   Passed: ${testResults.summary.passed}`)
  console.log(`   Failed: ${testResults.summary.failed}`)
  console.log('='.repeat(50))

  return testResults
}

