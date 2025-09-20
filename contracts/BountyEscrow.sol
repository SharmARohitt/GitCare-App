// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ReputationSystem.sol";

/**
 * @title BountyEscrow
 * @dev Manages escrow for GitHub bounties with automatic release on successful PR merge
 */
contract BountyEscrow is ReentrancyGuard, Ownable {
    
    struct Bounty {
        uint256 id;
        address issuer;
        address assignee;
        uint256 amount;
        address token; // ERC20 token address (address(0) for ETH)
        string githubRepo;
        string issueUrl;
        uint256 prNumber;
        BountyStatus status;
        uint256 createdAt;
        uint256 deadline;
        bool requiresApproval;
    }
    
    enum BountyStatus {
        Open,
        Assigned,
        InProgress,
        UnderReview,
        Completed,
        Cancelled,
        Disputed
    }
    
    // Events
    event BountyCreated(uint256 indexed bountyId, address indexed issuer, uint256 amount, string githubRepo);
    event BountyAssigned(uint256 indexed bountyId, address indexed assignee);
    event BountyCompleted(uint256 indexed bountyId, address indexed assignee, uint256 amount);
    event BountyCancelled(uint256 indexed bountyId, address indexed issuer);
    event DisputeRaised(uint256 indexed bountyId, address indexed raiser, string reason);
    event DisputeResolved(uint256 indexed bountyId, address winner, uint256 amount);
    
    // State variables
    mapping(uint256 => Bounty) public bounties;
    mapping(address => uint256[]) public userBounties;
    mapping(address => uint256[]) public assignedBounties;
    mapping(string => uint256) public repoBounties; // repo -> bountyId
    
    uint256 public nextBountyId = 1;
    uint256 public platformFee = 250; // 2.5% in basis points
    address public feeRecipient;
    
    ReputationSystem public reputationSystem;
    
    // GitHub webhook verification
    mapping(address => bool) public authorizedWebhooks;
    
    modifier onlyAuthorizedWebhook() {
        require(authorizedWebhooks[msg.sender], "Unauthorized webhook");
        _;
    }
    
    modifier onlyBountyIssuer(uint256 bountyId) {
        require(bounties[bountyId].issuer == msg.sender, "Not bounty issuer");
        _;
    }
    
    modifier onlyBountyAssignee(uint256 bountyId) {
        require(bounties[bountyId].assignee == msg.sender, "Not bounty assignee");
        _;
    }
    
    modifier bountyExists(uint256 bountyId) {
        require(bounties[bountyId].id != 0, "Bounty does not exist");
        _;
    }
    
    constructor(address _reputationSystem, address _feeRecipient) {
        reputationSystem = ReputationSystem(_reputationSystem);
        feeRecipient = _feeRecipient;
    }
    
    /**
     * @dev Create a new bounty with escrow
     */
    function createBounty(
        uint256 amount,
        address token,
        string memory githubRepo,
        string memory issueUrl,
        uint256 deadline,
        bool requiresApproval
    ) external payable nonReentrant returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(deadline > block.timestamp, "Deadline must be in the future");
        
        uint256 bountyId = nextBountyId++;
        
        // Handle payment
        if (token == address(0)) {
            require(msg.value == amount, "Incorrect ETH amount");
        } else {
            require(msg.value == 0, "ETH not needed for token bounty");
            IERC20(token).transferFrom(msg.sender, address(this), amount);
        }
        
        bounties[bountyId] = Bounty({
            id: bountyId,
            issuer: msg.sender,
            assignee: address(0),
            amount: amount,
            token: token,
            githubRepo: githubRepo,
            issueUrl: issueUrl,
            prNumber: 0,
            status: BountyStatus.Open,
            createdAt: block.timestamp,
            deadline: deadline,
            requiresApproval: requiresApproval
        });
        
        userBounties[msg.sender].push(bountyId);
        repoBounties[githubRepo] = bountyId;
        
        emit BountyCreated(bountyId, msg.sender, amount, githubRepo);
        return bountyId;
    }
    
    /**
     * @dev Assign bounty to a developer
     */
    function assignBounty(uint256 bountyId, address assignee) 
        external 
        bountyExists(bountyId) 
        onlyBountyIssuer(bountyId) 
    {
        require(bounties[bountyId].status == BountyStatus.Open, "Bounty not open");
        require(assignee != address(0), "Invalid assignee");
        
        bounties[bountyId].assignee = assignee;
        bounties[bountyId].status = BountyStatus.Assigned;
        assignedBounties[assignee].push(bountyId);
        
        emit BountyAssigned(bountyId, assignee);
    }
    
    /**
     * @dev Self-assign an open bounty
     */
    function selfAssignBounty(uint256 bountyId) 
        external 
        bountyExists(bountyId) 
    {
        require(bounties[bountyId].status == BountyStatus.Open, "Bounty not open");
        require(!bounties[bountyId].requiresApproval, "Bounty requires approval");
        
        bounties[bountyId].assignee = msg.sender;
        bounties[bountyId].status = BountyStatus.Assigned;
        assignedBounties[msg.sender].push(bountyId);
        
        emit BountyAssigned(bountyId, msg.sender);
    }
    
    /**
     * @dev Mark bounty as in progress (called when PR is created)
     */
    function markInProgress(uint256 bountyId, uint256 prNumber) 
        external 
        onlyAuthorizedWebhook 
        bountyExists(bountyId) 
    {
        require(bounties[bountyId].status == BountyStatus.Assigned, "Bounty not assigned");
        
        bounties[bountyId].prNumber = prNumber;
        bounties[bountyId].status = BountyStatus.InProgress;
    }
    
    /**
     * @dev Complete bounty and release funds (called when PR is merged)
     */
    function completeBounty(uint256 bountyId) 
        external 
        onlyAuthorizedWebhook 
        bountyExists(bountyId) 
        nonReentrant 
    {
        Bounty storage bounty = bounties[bountyId];
        require(bounty.status == BountyStatus.InProgress || bounty.status == BountyStatus.UnderReview, "Invalid status");
        require(bounty.assignee != address(0), "No assignee");
        
        bounty.status = BountyStatus.Completed;
        
        // Calculate fees
        uint256 fee = (bounty.amount * platformFee) / 10000;
        uint256 payout = bounty.amount - fee;
        
        // Transfer funds
        if (bounty.token == address(0)) {
            payable(bounty.assignee).transfer(payout);
            payable(feeRecipient).transfer(fee);
        } else {
            IERC20(bounty.token).transfer(bounty.assignee, payout);
            IERC20(bounty.token).transfer(feeRecipient, fee);
        }
        
        // Update reputation
        reputationSystem.recordSuccessfulCompletion(bounty.assignee, bounty.issuer, bountyId);
        
        emit BountyCompleted(bountyId, bounty.assignee, payout);
    }
    
    /**
     * @dev Cancel bounty and refund issuer
     */
    function cancelBounty(uint256 bountyId) 
        external 
        bountyExists(bountyId) 
        onlyBountyIssuer(bountyId) 
        nonReentrant 
    {
        Bounty storage bounty = bounties[bountyId];
        require(bounty.status == BountyStatus.Open || bounty.status == BountyStatus.Assigned, "Cannot cancel");
        
        bounty.status = BountyStatus.Cancelled;
        
        // Refund issuer
        if (bounty.token == address(0)) {
            payable(bounty.issuer).transfer(bounty.amount);
        } else {
            IERC20(bounty.token).transfer(bounty.issuer, bounty.amount);
        }
        
        emit BountyCancelled(bountyId, bounty.issuer);
    }
    
    /**
     * @dev Raise a dispute
     */
    function raiseDispute(uint256 bountyId, string memory reason) 
        external 
        bountyExists(bountyId) 
    {
        Bounty storage bounty = bounties[bountyId];
        require(
            msg.sender == bounty.issuer || msg.sender == bounty.assignee, 
            "Not authorized to dispute"
        );
        require(
            bounty.status == BountyStatus.InProgress || bounty.status == BountyStatus.UnderReview,
            "Invalid status for dispute"
        );
        
        bounty.status = BountyStatus.Disputed;
        emit DisputeRaised(bountyId, msg.sender, reason);
    }
    
    /**
     * @dev Resolve dispute (only owner)
     */
    function resolveDispute(uint256 bountyId, address winner) 
        external 
        onlyOwner 
        bountyExists(bountyId) 
        nonReentrant 
    {
        Bounty storage bounty = bounties[bountyId];
        require(bounty.status == BountyStatus.Disputed, "Not disputed");
        require(winner == bounty.issuer || winner == bounty.assignee, "Invalid winner");
        
        bounty.status = BountyStatus.Completed;
        
        if (winner == bounty.assignee) {
            // Pay assignee
            uint256 fee = (bounty.amount * platformFee) / 10000;
            uint256 payout = bounty.amount - fee;
            
            if (bounty.token == address(0)) {
                payable(bounty.assignee).transfer(payout);
                payable(feeRecipient).transfer(fee);
            } else {
                IERC20(bounty.token).transfer(bounty.assignee, payout);
                IERC20(bounty.token).transfer(feeRecipient, fee);
            }
            
            reputationSystem.recordSuccessfulCompletion(bounty.assignee, bounty.issuer, bountyId);
        } else {
            // Refund issuer
            if (bounty.token == address(0)) {
                payable(bounty.issuer).transfer(bounty.amount);
            } else {
                IERC20(bounty.token).transfer(bounty.issuer, bounty.amount);
            }
        }
        
        emit DisputeResolved(bountyId, winner, bounty.amount);
    }
    
    /**
     * @dev Get bounty details
     */
    function getBounty(uint256 bountyId) external view returns (Bounty memory) {
        return bounties[bountyId];
    }
    
    /**
     * @dev Get user's created bounties
     */
    function getUserBounties(address user) external view returns (uint256[] memory) {
        return userBounties[user];
    }
    
    /**
     * @dev Get user's assigned bounties
     */
    function getAssignedBounties(address user) external view returns (uint256[] memory) {
        return assignedBounties[user];
    }
    
    /**
     * @dev Admin functions
     */
    function setAuthorizedWebhook(address webhook, bool authorized) external onlyOwner {
        authorizedWebhooks[webhook] = authorized;
    }
    
    function setPlatformFee(uint256 _platformFee) external onlyOwner {
        require(_platformFee <= 1000, "Fee too high"); // Max 10%
        platformFee = _platformFee;
    }
    
    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        feeRecipient = _feeRecipient;
    }
    
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner()).transfer(amount);
        } else {
            IERC20(token).transfer(owner(), amount);
        }
    }
}