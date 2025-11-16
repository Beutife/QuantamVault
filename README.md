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
```

# MILESTONE-2-PLAN

# MILESTONE 2 PLAN: Quantum AI Marketplace  
**"The First Quantum-Secure, AI-Verified Data Economy on Polkadot"**  

**Team:** Quantum Vault Collective  
**Track:** [x] SHIP-A-TON  
**Date:** November 16, 2025  



## WHERE WE ARE NOW  

**What we built/validated this weekend:**  
- **Deployed Moonbeam smart contract** (`FileScopeRegistry.sol`) with full upload, purchase, and access control logic  
- **AI verification microservice** (Python/FastAPI) analyzing schema, outliers, duplicates — **quality score generated in <45s**  
- **XX Network CRYSTALS-Kyber encryption PoC** — dataset encrypted/decrypted with post-quantum keys  
- **Arkiv IPFS pinning integration** — 100-year TTL confirmed via API  
- **React frontend** with upload flow, marketplace grid, and Talisman/Metamask purchase — **live on Vercel**  

**What's working:**  
- Upload → AI analysis → quantum encrypt → Arkiv pinning → Moonbeam registry — **end-to-end in <2 minutes**  
- Purchase flow: USDC → seller receives 97.5%, buyer gets decryption key via encrypted message  
- Cross-chain query via **Hyperbridge testnet** — Ethereum wallet sees Polkadot dataset  

**What still needs work:**  
- Pagination for public datasets (current `getAllPublicDatasets()` crashes compiler)  
- Multi-token support (only USDC now)
- Purchase of data 
- Seller analytics dashboard  
- Real XX Network mixnet routing (currently local key exchange)  

**Blockers or hurdles we hit:**  
- **Contract size explosion (150 KB → 22 KB)** after removing `Dataset[]` returns  
- **Remix gas limit config** (`0x2dc6c0`) — fixed by increasing to `8M`  
- **Arkiv API rate limits** during stress test — resolved with batch pinning  


## WHAT WE'LL SHIP IN 30 DAYS  

**Our MVP will do this:**  
> A **quantum-secure, AI-verified marketplace** where researchers upload datasets, get instant quality scores, encrypt with post-quantum keys, and sell directly to AI teams — all on Polkadot with **2.5% fees** and **permanent Arkiv storage**.  

### Features We'll Build (4 Core — Ruthlessly Prioritized)

#### **Week 1–2: Production-Grade Core**  
- **Feature:** **Real XX Network Integration + Mixnet Privacy**  
  - Replace local Kyber with **XX SDK v1.2**  
  - Route metadata through **cMix mixnet** (hides uploader IP)  
  - Auto key rotation every 24h  
  - **Why it matters:** First *truly quantum-secure* data upload — no competitor has this  
   

- **Feature:** **Arkiv Auto-Renewal + TTL Dashboard**  
  - Smart contract pays Arkiv fees from platform treasury  
  - Frontend shows "Expires in 98 years" with renewal button  
  - **Why it matters:** Guarantees **100-year data permanence** — Kaggle can’t promise this  
   

#### **Week 2–3: User Growth Engine**  
- **Feature:** **Paginated Marketplace + Search + Preview**  
  - Replace `getAllPublicDatasets()` with `getDatasetPage(start, limit)`  
  - Search by: `quality_score > 85`, `price < $100`, `category: medical`  
  - Free preview: **first 100 rows** (unencrypted sample)  
  - **Why it matters:** **10x faster load**, enables 10k+ datasets  
  

#### **Week 3–4: Monetization & Analytics**  
- **Feature:** **Multi-Token Payments + Seller Dashboard**  
  - Accept **DOT, USDC, USDT** via Moonbeam  
  - Real-time earnings chart, download heatmap, quality trend  
  - Auto-withdraw to wallet  
  - **Why it matters:** Sellers see **"I earned $427 this week"** — drives retention  
  



### Team Breakdown  

| **Name** | **Role** | **Hrs/Week** |  
|---|---|---|---|  
| **@beutech_codes** |Full-Stack dev  
| **@robertocalous** | Full-Stack dev 

> ** 20 hrs/week commitment** **laser-focused execution**  


### Mentoring & Expertise We Need  

**Areas where we need support:**  
- **XX Network SDK edge cases** (key revocation, mixnet failover)  
- **OpenZeppelin audit prep** (formal verification for access control)  
- **W3F Grant writing** (polishing $50k proposal)  

**Specific expertise we're looking for:**  
- **1 mentor session** with **XX Network core dev** (30 mins)  
- **Code review** from **Moonbeam/Hyperbridge engineer**  
- **Grant strategist** (1 hr) to review W3F submission  



## WHAT HAPPENS AFTER  

**When M2 is done, we plan to...**  
- Launch **public beta** with **100 whitelisted researchers** (from r/MachineLearning)  
- Seed **20 premium datasets** ($5k budget from prize)  
- Submit **Web3 Foundation Grant** ($50k) for cross-chain expansion  

**And 6 months out we see our project achieve:**  
- **10,000 users** (researchers + AI startups)  
- **$100k GMV** (Gross Marketplace Volume)  
- **500+ quantum-secured datasets**  
- **Polkadot’s official data layer** — integrated with Acala, Astar, Phala  
- **DAO-governed** with **DATA token** for staking + governance  



**Let’s make AI data **unbreakable**, **verifiable**, and **decentralized** — starting **now**.**  


*Live Demo: [quantum-ai-vault.market](https://quantam-vault.vercel.app/)*  


**Ready to deploy. Ready to disrupt. Ready to win.**
