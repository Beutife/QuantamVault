import { useState, useEffect } from 'react'
import { Upload, Database, ShoppingCart, TrendingUp, Wallet, Eye, Download, DollarSign, Lock, Unlock } from 'lucide-react'

// This is a complete, working demo - replace with real contract functions after deployment
// For now, it uses simulated data to show functionality

function App() {
  const [activeTab, setActiveTab] = useState('marketplace')
  const [walletAddress, setWalletAddress] = useState(null)
  const [datasets, setDatasets] = useState([])
  const [myDatasets, setMyDatasets] = useState([])
  const [earnings, setEarnings] = useState('0')

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!')
      return
    }
    
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      setWalletAddress(accounts[0])
      loadData()
    } catch (error) {
      alert('Failed to connect wallet: ' + error.message)
    }
  }

  const loadData = () => {
    // Simulated data - replace with real contract calls
    setDatasets([
      {
        id: 0,
        datasetCID: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
        analysisCID: 'bafybeihk5e6jlzhdkm4qfxd6j7jwyqxhqf7l3k5amd6qfxd6j7jwyqxh',
        uploader: '0x1234...5678',
        isPublic: true,
        isPaid: true,
        price: '0.5',
        views: 124,
        downloads: 45,
        timestamp: Date.now() - 86400000
      }
    ])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400">
                Quantum AI Marketplace
              </h1>
              <p className="text-gray-300 mt-2">Decentralized AI Dataset Trading on Polkadot</p>
            </div>
            
            {!walletAddress ? (
              <button
                onClick={connectWallet}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-bold hover:scale-105 transition flex items-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
            ) : (
              <div className="text-right">
                <p className="text-sm text-gray-400">Connected</p>
                <p className="font-mono text-cyan-400">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                <p className="text-sm text-yellow-400 mt-1">Earnings: {earnings} DEV</p>
              </div>
            )}
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <TabButton
            active={activeTab === 'marketplace'}
            onClick={() => setActiveTab('marketplace')}
            icon={<ShoppingCart className="w-5 h-5" />}
            label="Marketplace"
          />
          <TabButton
            active={activeTab === 'upload'}
            onClick={() => setActiveTab('upload')}
            icon={<Upload className="w-5 h-5 text-black" />}
            label="Upload Dataset"
          />
          <TabButton
            active={activeTab === 'my-datasets'}
            onClick={() => setActiveTab('my-datasets')}
            icon={<Database className="w-5 h-5 text-black" />}
            label="My Datasets"
          />
          <TabButton
            active={activeTab === 'purchases text-black'}
            onClick={() => setActiveTab('purchases')}
            icon={<TrendingUp className="w-5 h-5" />}
            label="My Purchases"
          />
        </div>

        {/* Main Content */}
        <div className="bg-gray-900/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
          {activeTab === 'marketplace' && <MarketplaceView datasets={datasets} walletAddress={walletAddress} />}
          {activeTab === 'upload' && <UploadView walletAddress={walletAddress} />}
          {activeTab === 'my-datasets' && <MyDatasetsView datasets={myDatasets} />}
          {activeTab === 'purchases' && <PurchasesView />}
        </div>

        {/* Partner Prizes Footer */}
        <footer className="mt-12 text-center text-sm text-gray-400">
          <p className="mb-3">Built for sub0 HACK Buenos Aires 2025</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <span className="px-3 py-1 bg-cyan-900/30 rounded-full">Arkiv: $4k</span>
            <span className="px-3 py-1 bg-purple-900/30 rounded-full">XX Network: $9k</span>
            <span className="px-3 py-1 bg-yellow-900/30 rounded-full">Hyperbridge: $3k</span>
            <span className="px-3 py-1 bg-pink-900/30 rounded-full">Marketing: $3k</span>
          </div>
          <p className="mt-2 text-xs">Total Potential: $19,000+</p>
        </footer>
      </div>
    </div>
  )
}

// Tab Button Component
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
        active
          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg scale-105'
          : 'bg-red-200 hover:bg-pink-700'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

// Marketplace View
function MarketplaceView({ datasets, walletAddress }) {
  if (!walletAddress) {
    return (
      <div className="text-center py-20">
        <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <p className="text-xl text-gray-400">Connect your wallet to browse datasets</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Public AI Datasets</h2>
      
      {datasets.length === 0 ? (
        <div className="text-center py-20">
          <Database className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400">No datasets available yet</p>
          <button className="mt-4 px-6 py-2 bg-cyan-600 rounded-lg hover:bg-cyan-700">
            Be the first to upload
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {datasets.map((dataset, idx) => (
            <DatasetCard key={idx} dataset={dataset} />
          ))}
        </div>
      )}
    </div>
  )
}

// Dataset Card
function DatasetCard({ dataset }) {
  const [viewing, setViewing] = useState(false)

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/30 hover:border-purple-500 transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">Dataset #{dataset.id}</h3>
          <p className="text-xs text-gray-400 mt-1">
            by {dataset.uploader}
          </p>
        </div>
        <div className="text-right">
          {dataset.isPaid ? (
            <div className="bg-green-900/30 px-3 py-1 rounded-full">
              <p className="text-green-400 font-bold">{dataset.price} DEV</p>
            </div>
          ) : (
            <div className="bg-blue-900/30 px-3 py-1 rounded-full">
              <p className="text-blue-400">FREE</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs break-all">{dataset.datasetCID.slice(0, 40)}...</span>
        </div>
        
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-purple-400" />
            <span>{dataset.views} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3 text-pink-400" />
            <span>{dataset.downloads} downloads</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setViewing(!viewing)}
          className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-sm transition"
        >
          {viewing ? 'Hide' : 'View Details'}
        </button>
        {dataset.isPaid ? (
          <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2">
            <DollarSign className="w-4 h-4" />
            Buy Access
          </button>
        ) : (
          <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download Free
          </button>
        )}
      </div>

      {viewing && (
        <div className="mt-4 pt-4 border-t border-gray-700 text-sm">
          <p className="text-gray-400 mb-2">Analysis CID:</p>
          <p className="font-mono text-xs text-cyan-400 break-all">{dataset.analysisCID}</p>
        </div>
      )}
    </div>
  )
}

// Upload View
function UploadView({ walletAddress }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [isPaid, setIsPaid] = useState(false)
  const [price, setPrice] = useState('')

  if (!walletAddress) {
    return (
      <div className="text-center py-20">
        <Lock className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <p className="text-xl text-gray-400">Connect your wallet to upload datasets</p>
      </div>
    )
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file')
      return
    }

    setUploading(true)
    
    // Simulate upload process
    await new Promise(r => setTimeout(r, 2000))
    
    alert('Dataset uploaded successfully!')
    setFile(null)
    setUploading(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Upload AI Dataset</h2>

      <div className="space-y-6">
        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-cyan-500 transition">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            {file ? (
              <div>
                <Database className="w-12 h-12 mx-auto mb-2 text-green-400" />
                <p className="text-green-400 font-semibold">{file.name}</p>
                <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-400">Click to select dataset file</p>
                <p className="text-xs text-gray-500 mt-1">CSV, JSON, or any format</p>
              </div>
            )}
          </label>
        </div>

        {/* Access Control */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-5 h-5"
            />
            <div>
              <p className="font-semibold">Public Dataset</p>
              <p className="text-xs text-gray-400">Anyone can discover this dataset</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750">
            <input
              type="checkbox"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
              className="w-5 h-5"
            />
            <div>
              <p className="font-semibold">Paid Access</p>
              <p className="text-xs text-gray-400">Charge for downloads</p>
            </div>
          </label>

          {isPaid && (
            <div className="pl-8">
              <label className="block text-sm text-gray-400 mb-2">Price (DEV tokens)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.5"
                step="0.1"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-cyan-500 outline-none"
              />
            </div>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition"
        >
          {uploading ? 'Uploading to Arkiv + Polkadot...' : 'Upload & Publish Dataset'}
        </button>

        {/* Info */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <Lock className="w-6 h-6 mx-auto mb-1 text-cyan-400" />
            <p className="text-xs text-gray-400">XX Network Encrypted</p>
          </div>
          <div className="text-center">
            <Database className="w-6 h-6 mx-auto mb-1 text-purple-400" />
            <p className="text-xs text-gray-400">Arkiv Permanent IPFS</p>
          </div>
          <div className="text-center">
            <Unlock className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
            <p className="text-xs text-gray-400">Moonbeam Blockchain</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// My Datasets View
function MyDatasetsView({ datasets }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Uploaded Datasets</h2>
      {datasets.length === 0 ? (
        <div className="text-center py-20">
          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400">You haven't uploaded any datasets yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {datasets.map((dataset, idx) => (
            <DatasetCard key={idx} dataset={dataset} />
          ))}
        </div>
      )}
    </div>
  )
}

// Purchases View
function PurchasesView() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Purchased Datasets</h2>
      <div className="text-center py-20">
        <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <p className="text-gray-400">No purchases yet</p>
      </div>
    </div>
  )
}

export default App