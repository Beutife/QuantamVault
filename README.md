# **QuantumAI Protocol**
### *Decentralized Dataset Storage, Monetization & AI Analysis using Arkiv + EVM Smart Contracts*

QuantumAI is a decentralized protocol enabling users to upload, store, monetize, and analyze datasets using:

- **On-chain smart contracts** for ownership, pricing, and access control  
- **Arkiv decentralized data layer** for file storage, metadata, TTL, and subscriptions  
- **EIP-712 wallet signing** for secure operations  

This creates a complete ecosystem for **AI datasets, research files, and digital knowledge markets**.

---

## 🚀 Features

### **🧠 Smart Contract Features**
- Upload datasets with:
  - Dataset CID
  - Optional analysis CID
  - Public / Private / Paid access modes
- Sell datasets for ERC-20 tokens
- Track:
  - Views  
  - Downloads  
  - Publisher earnings  
- Paginated public dataset listings
- Reentrancy protection
- Multi-token payment support

### **📁 Arkiv Storage Features**
- File upload → returns CID
- TTL-based file expiration
- Update metadata with EIP-712 signatures
- Delete files securely
- Real-time updates via WebSockets
- Query files by metadata or filters

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Smart Contracts | Solidity 0.8.24, OpenZeppelin |
| Storage Layer | Arkiv (Decentralized Data Layer) |
| Frontend | React, Vite, Wagmi, Viem |
| Auth | EIP-712 Signing |
| Wallets | MetaMask, WalletConnect |

---

# 📁 Project Structure

/contracts
QuantumAi.sol
/src
arkiv/
arkivClient.js
components/
pages/
README.md



---

# 🔧 Installation

### 1. Install dependencies
```bash
npm install


ARKIV_API_URL=https://api.arkiv.org
ARKIV_NETWORK=ethereum
