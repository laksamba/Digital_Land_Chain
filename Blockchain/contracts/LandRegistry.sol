// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LandRegistryBackendHash is AccessControl, ReentrancyGuard {
    // Counters
    uint256 private _landIdCounter = 1; // Start from 1
    uint256 private _requestIdCounter = 1; // Start from 1

    // Roles
    bytes32 public constant LAND_OFFICER_ROLE = keccak256("LAND_OFFICER");

    struct Land {
        uint256 landId;
        address owner;
        bytes32 landHash; // hashed land info stored off-chain
        bool isVerified;
        address[] ownershipHistory; // track ownership on-chain
    }

    struct TransferRequest {
        uint256 landId;
        address from;
        address to;
        bool approved;
    }

    struct RegistrationRequest {
        bytes32 landHash;
        address requester;
        bool approved;
    }

    mapping(uint256 => Land) public lands;
    mapping(uint256 => TransferRequest) public transfers;
    mapping(uint256 => RegistrationRequest) public registrationRequests;

    event LandRegistered(uint256 indexed landId, address indexed owner, bytes32 landHash);
    event LandVerified(uint256 indexed landId, address indexed approver);
    event TransferInitiated(uint256 indexed landId, address indexed from, address indexed to);
    event TransferApproved(uint256 indexed landId, address indexed approver);
    event OwnershipTransferred(uint256 indexed landId, address indexed oldOwner, address indexed newOwner);
    event RegistrationRequested(uint256 indexed requestId, address indexed requester, bytes32 landHash);
    event RegistrationApproved(uint256 indexed requestId, address indexed approver);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Add a new land officer
    function addLandOfficer(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(account != address(0), "Invalid address");
        grantRole(LAND_OFFICER_ROLE, account);
    }

    // User submits land registration request
    function submitRegistrationRequest(bytes32 _landHash) external {
        require(_landHash != bytes32(0), "Hash required");

        uint256 requestId = _requestIdCounter;
        _requestIdCounter++;

        registrationRequests[requestId] = RegistrationRequest({
            landHash: _landHash,
            requester: msg.sender,
            approved: false
        });

        emit RegistrationRequested(requestId, msg.sender, _landHash);
    }

    // Land officer approves registration request and officially registers land
    function approveRegistrationRequest(uint256 requestId) external onlyRole(LAND_OFFICER_ROLE) {
        RegistrationRequest storage request = registrationRequests[requestId];
        require(request.requester != address(0), "Request not found");
        require(!request.approved, "Already approved");

        request.approved = true;

        uint256 newId = _landIdCounter;
        _landIdCounter++;

        address[] memory initialHistory = new address[](1);
        initialHistory[0] = request.requester;

        lands[newId] = Land({
            landId: newId,
            owner: request.requester,
            landHash: request.landHash,
            isVerified: false,
            ownershipHistory: initialHistory
        });

        emit LandRegistered(newId, request.requester, request.landHash);
        emit RegistrationApproved(requestId, msg.sender);
    }

    // Verify land by officer
    function verifyLand(uint256 landId) external onlyRole(LAND_OFFICER_ROLE) {
        require(lands[landId].landId != 0, "Land does not exist");
        require(!lands[landId].isVerified, "Already verified");

        lands[landId].isVerified = true;
        emit LandVerified(landId, msg.sender);
    }

    // Owner initiates transfer
    function initiateTransfer(uint256 landId, address to) external {
        require(lands[landId].landId != 0, "Land does not exist");
        require(lands[landId].owner == msg.sender, "Not the owner");
        require(to != address(0), "Invalid recipient");
        require(lands[landId].isVerified, "Land not verified");

        transfers[landId] = TransferRequest({
            landId: landId,
            from: msg.sender,
            to: to,
            approved: false
        });

        emit TransferInitiated(landId, msg.sender, to);
    }

    // Land officer approves transfer
    function approveTransfer(uint256 landId) external onlyRole(LAND_OFFICER_ROLE) {
        require(transfers[landId].landId != 0, "Transfer not found");
        require(!transfers[landId].approved, "Already approved");

        transfers[landId].approved = true;
        emit TransferApproved(landId, msg.sender);
    }

    // Recipient finalizes the transfer
    function finalizeTransfer(uint256 landId) external nonReentrant {
        require(transfers[landId].landId != 0, "Transfer not initiated");
        require(transfers[landId].approved, "Transfer not approved");
        require(msg.sender == transfers[landId].to, "Only recipient can accept");

        Land storage land = lands[landId];
        address oldOwner = land.owner;
        land.owner = msg.sender;
        land.ownershipHistory.push(msg.sender);

        emit OwnershipTransferred(landId, oldOwner, msg.sender);

        delete transfers[landId];
    }

    // Check if certificate hash matches (off-chain hashing)
    function verifyCertificate(uint256 landId, bytes32 inputHash) external view returns (bool) {
        require(lands[landId].landId != 0, "Land does not exist");
        return lands[landId].landHash == inputHash;
    }

    // View land details (no location anymore)
    function getLand(uint256 landId) external view returns (
        address owner,
        bool isVerified,
        bytes32 landHash
    ) {
        require(lands[landId].landId != 0, "Land does not exist");
        Land memory land = lands[landId];
        return (land.owner, land.isVerified, land.landHash);
    }

    // View all owners in history
    function getOwnershipHistory(uint256 landId) external view returns (address[] memory) {
        require(lands[landId].landId != 0, "Land does not exist");
        return lands[landId].ownershipHistory;
    }
}