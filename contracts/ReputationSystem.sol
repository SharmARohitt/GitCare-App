// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ReputationSystem
 * @dev Manages developer reputation scores and ratings for hiring evaluation
 */
contract ReputationSystem is Ownable, ReentrancyGuard {
    
    struct DeveloperProfile {
        address developer;
        uint256 totalScore;
        uint256 completedBounties;
        uint256 totalEarnings;
        uint256 averageRating; // Out of 1000 (10.00 = 1000)
        uint256 totalRatings;
        mapping(string => uint256) skillRatings; // skill -> average rating
        mapping(address => bool) hasRated; // issuer -> has rated this developer
        string[] skills;
        bool isVerified;
        uint256 joinedAt;
        uint256 lastActiveAt;
    }
    
    struct Rating {
        address issuer;
        address developer;
        uint256 bountyId;
        uint256 codeQuality; // 1-10
        uint256 communication; // 1-10
        uint256 timeliness; // 1-10
        uint256 reliability; // 1-10
        string feedback;
        uint256 timestamp;
    }
    
    struct Skill {
        string name;
        uint256 endorsements;
        uint256 averageRating;
        address[] endorsers;
    }
    
    // Events
    event ProfileCreated(address indexed developer, uint256 timestamp);
    event BountyCompleted(address indexed developer, uint256 bountyId, uint256 amount);
    event RatingSubmitted(address indexed issuer, address indexed developer, uint256 bountyId, uint256 overallRating);
    event SkillEndorsed(address indexed endorser, address indexed developer, string skill);
    event ReputationUpdated(address indexed developer, uint256 newScore, uint256 newRating);
    event DeveloperVerified(address indexed developer, address verifier);
    
    // State variables
    mapping(address => DeveloperProfile) public developers;
    mapping(uint256 => Rating) public ratings;
    mapping(address => mapping(string => Skill)) public developerSkills;
    mapping(address => uint256[]) public developerRatings;
    
    address[] public allDevelopers;
    uint256 public nextRatingId = 1;
    
    // Reputation calculation weights
    uint256 public constant COMPLETION_WEIGHT = 40;
    uint256 public constant RATING_WEIGHT = 35;
    uint256 public constant EARNINGS_WEIGHT = 15;
    uint256 public constant ACTIVITY_WEIGHT = 10;
    
    modifier onlyRegisteredDeveloper() {
        require(developers[msg.sender].developer != address(0), "Developer not registered");
        _;
    }
    
    modifier onlyBountyEscrow() {
        // This should be set to the BountyEscrow contract address
        require(msg.sender == owner(), "Only bounty escrow can call");
        _;
    }
    
    /**
     * @dev Register a new developer profile
     */
    function registerDeveloper(string[] memory skills) external {
        require(developers[msg.sender].developer == address(0), "Already registered");
        
        DeveloperProfile storage profile = developers[msg.sender];
        profile.developer = msg.sender;
        profile.totalScore = 1000; // Starting score
        profile.averageRating = 0;
        profile.joinedAt = block.timestamp;
        profile.lastActiveAt = block.timestamp;
        profile.skills = skills;
        
        allDevelopers.push(msg.sender);
        
        emit ProfileCreated(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Record successful bounty completion (called by BountyEscrow)
     */
    function recordSuccessfulCompletion(
        address developer, 
        address issuer, 
        uint256 bountyId
    ) external onlyBountyEscrow {
        DeveloperProfile storage profile = developers[developer];
        require(profile.developer != address(0), "Developer not registered");
        
        profile.completedBounties++;
        profile.lastActiveAt = block.timestamp;
        
        // Update reputation score
        _updateReputationScore(developer);
        
        emit BountyCompleted(developer, bountyId, 0);
    }
    
    /**
     * @dev Submit rating for a developer after bounty completion
     */
    function submitRating(
        address developer,
        uint256 bountyId,
        uint256 codeQuality,
        uint256 communication,
        uint256 timeliness,
        uint256 reliability,
        string memory feedback
    ) external {
        require(developers[developer].developer != address(0), "Developer not registered");
        require(!developers[developer].hasRated[msg.sender], "Already rated this developer");
        require(codeQuality >= 1 && codeQuality <= 10, "Invalid code quality rating");
        require(communication >= 1 && communication <= 10, "Invalid communication rating");
        require(timeliness >= 1 && timeliness <= 10, "Invalid timeliness rating");
        require(reliability >= 1 && reliability <= 10, "Invalid reliability rating");
        
        uint256 ratingId = nextRatingId++;
        uint256 overallRating = (codeQuality + communication + timeliness + reliability) * 25; // Convert to 1000 scale
        
        ratings[ratingId] = Rating({
            issuer: msg.sender,
            developer: developer,
            bountyId: bountyId,
            codeQuality: codeQuality,
            communication: communication,
            timeliness: timeliness,
            reliability: reliability,
            feedback: feedback,
            timestamp: block.timestamp
        });
        
        // Update developer's average rating
        DeveloperProfile storage profile = developers[developer];
        profile.hasRated[msg.sender] = true;
        
        uint256 totalRatingScore = profile.averageRating * profile.totalRatings + overallRating;
        profile.totalRatings++;
        profile.averageRating = totalRatingScore / profile.totalRatings;
        
        developerRatings[developer].push(ratingId);
        
        // Update overall reputation score
        _updateReputationScore(developer);
        
        emit RatingSubmitted(msg.sender, developer, bountyId, overallRating);
    }
    
    /**
     * @dev Endorse a developer's skill
     */
    function endorseSkill(address developer, string memory skillName) external {
        require(developers[developer].developer != address(0), "Developer not registered");
        require(msg.sender != developer, "Cannot endorse yourself");
        
        Skill storage skill = developerSkills[developer][skillName];
        
        // Check if already endorsed
        for (uint i = 0; i < skill.endorsers.length; i++) {
            require(skill.endorsers[i] != msg.sender, "Already endorsed");
        }
        
        skill.endorsers.push(msg.sender);
        skill.endorsements++;
        
        emit SkillEndorsed(msg.sender, developer, skillName);
    }
    
    /**
     * @dev Get developer's reputation score
     */
    function getReputationScore(address developer) external view returns (uint256) {
        return developers[developer].totalScore;
    }
    
    /**
     * @dev Get developer's detailed profile
     */
    function getDeveloperProfile(address developer) external view returns (
        uint256 totalScore,
        uint256 completedBounties,
        uint256 totalEarnings,
        uint256 averageRating,
        uint256 totalRatings,
        string[] memory skills,
        bool isVerified,
        uint256 joinedAt,
        uint256 lastActiveAt
    ) {
        DeveloperProfile storage profile = developers[developer];
        return (
            profile.totalScore,
            profile.completedBounties,
            profile.totalEarnings,
            profile.averageRating,
            profile.totalRatings,
            profile.skills,
            profile.isVerified,
            profile.joinedAt,
            profile.lastActiveAt
        );
    }
    
    /**
     * @dev Get top developers by reputation
     */
    function getTopDevelopers(uint256 limit) external view returns (address[] memory) {
        require(limit <= allDevelopers.length, "Limit exceeds total developers");
        
        // Simple sorting - in production, consider using a more efficient method
        address[] memory topDevs = new address[](limit);
        uint256[] memory scores = new uint256[](limit);
        
        for (uint i = 0; i < allDevelopers.length && i < limit; i++) {
            address dev = allDevelopers[i];
            uint256 score = developers[dev].totalScore;
            
            // Insert in sorted order
            uint256 j = i;
            while (j > 0 && scores[j-1] < score) {
                topDevs[j] = topDevs[j-1];
                scores[j] = scores[j-1];
                j--;
            }
            topDevs[j] = dev;
            scores[j] = score;
        }
        
        return topDevs;
    }
    
    /**
     * @dev Internal function to update reputation score
     */
    function _updateReputationScore(address developer) internal {
        DeveloperProfile storage profile = developers[developer];
        
        uint256 completionScore = profile.completedBounties * COMPLETION_WEIGHT;
        uint256 ratingScore = (profile.averageRating * RATING_WEIGHT) / 100;
        uint256 earningsScore = (profile.totalEarnings / 1e18) * EARNINGS_WEIGHT; // Assuming 18 decimals
        
        // Activity score based on recent activity
        uint256 daysSinceActive = (block.timestamp - profile.lastActiveAt) / 86400;
        uint256 activityScore = daysSinceActive > 30 ? 0 : (30 - daysSinceActive) * ACTIVITY_WEIGHT;
        
        profile.totalScore = completionScore + ratingScore + earningsScore + activityScore;
        
        emit ReputationUpdated(developer, profile.totalScore, profile.averageRating);
    }
    
    /**
     * @dev Verify a developer (for trusted developers)
     */
    function verifyDeveloper(address developer) external onlyOwner {
        require(developers[developer].developer != address(0), "Developer not registered");
        developers[developer].isVerified = true;
        emit DeveloperVerified(developer, msg.sender);
    }
    
    /**
     * @dev Update developer's earnings (called by BountyEscrow)
     */
    function updateEarnings(address developer, uint256 amount) external onlyBountyEscrow {
        developers[developer].totalEarnings += amount;
        _updateReputationScore(developer);
    }
    
    /**
     * @dev Get skill endorsements for a developer
     */
    function getSkillEndorsements(address developer, string memory skillName) 
        external 
        view 
        returns (uint256 endorsements, address[] memory endorsers) 
    {
        Skill storage skill = developerSkills[developer][skillName];
        return (skill.endorsements, skill.endorsers);
    }
}