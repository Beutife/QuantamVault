// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// =================================================================
// BASE STORAGE CONTRACT
// =================================================================
contract QuantumAiStorage is Ownable {
    struct Dataset {
        string datasetCID;
        string analysisCID;
        address uploader;
        bool isPublic;
        bool isPrivate;
        uint48 timestamp;
        uint48 views;
        uint48 downloads;
        bool isPaid;
        uint128 priceInFIL;
        uint128 earnings;
    }

    struct PaymentToken {
        address tokenAddress;
        bool isAccepted;
        string symbol;
    }

    mapping(string => bool) internal cidExists;
    mapping(uint256 => Dataset) internal datasets;
    mapping(address => uint256[]) internal userUploads;
    mapping(uint256 => mapping(address => bool)) internal hasAccess;
    mapping(address => uint128) internal publisherEarnings;
    uint128 internal totalPlatformEarnings;

    mapping(address => PaymentToken) public paymentTokens;
    mapping(uint256 => address) public acceptedTokenByIndex;
    uint256 public acceptedTokenCount;
    uint256 internal datasetCount;

    constructor() Ownable(msg.sender) {}
}

// =================================================================
// PAYMENT TOKEN MANAGEMENT
// =================================================================
contract QuantumAiPayments is QuantumAiStorage {
    event PaymentTokenAdded(address indexed token, string symbol);

    function addPaymentToken(address token, string memory symbol) external onlyOwner {
        require(token != address(0), "Zero");
        require(!paymentTokens[token].isAccepted, "Exists");
        paymentTokens[token] = PaymentToken(token, true, symbol);
        acceptedTokenByIndex[acceptedTokenCount++] = token;
        emit PaymentTokenAdded(token, symbol);
    }

    function isTokenAccepted(address token) public view returns (bool) {
        return paymentTokens[token].isAccepted;
    }
}

// =================================================================
// DATASET MANAGEMENT
// =================================================================
contract QuantumAiDatasets is QuantumAiPayments, ReentrancyGuard {
    event DatasetUploaded(uint256 indexed id, address uploader, bool isPublic, bool isPaid, uint128 price);
    event PublicDatasetListed(uint256 indexed id, address uploader);

    modifier onlyUploader(uint256 id) {
        require(datasets[id].uploader == msg.sender, "Not uploader");
        _;
    }

    modifier canView(uint256 id) {
        Dataset memory d = datasets[id];
        require(d.uploader == msg.sender || (d.isPublic && !d.isPrivate), "No view");
        _;
    }

    function uploadDataset(
        string memory _cid,
        string memory _analysis,
        bool _public,
        bool _private,
        bool _paid,
        uint256 _price
    ) external nonReentrant {
        require(!cidExists[_cid], "CID exists");
        require(bytes(_cid).length > 0, "CID empty");
        require(!(_public && _private), "Public+Private");
        if (_private) require(!_paid, "Private not paid");
        if (_paid) require(_price > 0, "Price 0");

        cidExists[_cid] = true;

        uint256 id = datasetCount++;
        datasets[id] = Dataset({
            datasetCID: _cid,
            analysisCID: _analysis,
            uploader: msg.sender,
            isPublic: _public,
            isPrivate: _private,
            timestamp: uint48(block.timestamp),
            views: 0,
            downloads: 0,
            isPaid: _paid,
            priceInFIL: uint128(_price),
            earnings: 0
        });

        userUploads[msg.sender].push(id);

        emit DatasetUploaded(id, msg.sender, _public, _paid, uint128(_price));
        if (_public && !_private) emit PublicDatasetListed(id, msg.sender);
    }

    function getDataset(uint256 id) external view canView(id) returns (Dataset memory) {
        return datasets[id];
    }

    function incrementViews(uint256 id) external canView(id) {
        datasets[id].views++;
    }

    function totalDatasets() external view returns (uint256) {
        return datasetCount;
    }
}

// =================================================================
// PURCHASE & ACCESS MANAGEMENT
// =================================================================
contract QuantumAiPurchase is QuantumAiDatasets {
    event DatasetPurchased(uint256 indexed id, address buyer, address publisher, uint128 amount, address token);

    modifier canDownload(uint256 id) {
        Dataset memory d = datasets[id];
        require(
            d.uploader == msg.sender || !d.isPaid || hasAccess[id][msg.sender],
            "No download"
        );
        _;
    }

    function purchaseDataset(uint256 id, address token) external nonReentrant {
        Dataset storage d = datasets[id];
        require(d.isPublic && !d.isPrivate, "Not public");
        require(d.isPaid, "Free");
        require(!hasAccess[id][msg.sender], "Already");
        require(d.uploader != msg.sender, "Own");
        require(paymentTokens[token].isAccepted, "Token");

        IERC20(token).transferFrom(msg.sender, d.uploader, d.priceInFIL);

        hasAccess[id][msg.sender] = true;
        d.earnings += d.priceInFIL;
        publisherEarnings[d.uploader] += d.priceInFIL;
        totalPlatformEarnings += d.priceInFIL;

        emit DatasetPurchased(id, msg.sender, d.uploader, d.priceInFIL, token);
    }

    function incrementDownloads(uint256 id) external canDownload(id) {
        datasets[id].downloads++;
    }

    function getMyEarnings() external view returns (uint128) {
        return publisherEarnings[msg.sender];
    }

    function getDatasetEarnings(uint256 id) external view returns (uint128) {
        require(datasets[id].uploader == msg.sender || owner() == msg.sender, "Auth");
        return datasets[id].earnings;
    }
}

// =================================================================
// MAIN CONTRACT WITH QUERIES
// =================================================================
contract QuantumAi is QuantumAiPurchase {
    function getPublicDatasetPage(uint256 start, uint256 limit)
        external
        view
        returns (Dataset[] memory page, uint256 nextStart)
    {
        uint256 total = 0;
        for (uint256 i = 0; i < datasetCount; i++) {
            if (datasets[i].isPublic && !datasets[i].isPrivate) total++;
        }
        if (start >= total) return (new Dataset[](0), 0);

        uint256 end = start + limit;
        if (end > total) end = total;

        Dataset[] memory p = new Dataset[](end - start);
        uint256 idx = 0;
        uint256 cursor = 0;

        for (uint256 i = 0; i < datasetCount; i++) {
            if (datasets[i].isPublic && !datasets[i].isPrivate) {
                if (cursor >= start && cursor < end) {
                    p[idx++] = datasets[i];
                }
                cursor++;
                if (cursor >= end) break;
            }
        }
        return (p, end);
    }

    function getMyDatasetIds() external view returns (uint256[] memory) {
        return userUploads[msg.sender];
    }

    function getMyPurchasedIds() external view returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](datasetCount);
        uint256 cnt = 0;
        for (uint256 i = 0; i < datasetCount; i++) {
            if (hasAccess[i][msg.sender] && datasets[i].uploader != msg.sender) {
                ids[cnt++] = i;
            }
        }
        uint256[] memory res = new uint256[](cnt);
        for (uint256 i = 0; i < cnt; i++) res[i] = ids[i];
        return res;
    }
}
