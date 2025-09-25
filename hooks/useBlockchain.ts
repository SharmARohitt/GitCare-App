import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

export interface BountyData {
  id: number;
  issuer: string;
  assignee: string;
  amount: string;
  token: string;
  githubRepo: string;
  issueUrl: string;
  prNumber: number;
  status: number;
  createdAt: number;
  deadline: number;
  requiresApproval: boolean;
}

export interface DeveloperProfile {
  totalScore: number;
  completedBounties: number;
  totalEarnings: string;
  averageRating: number;
  totalRatings: number;
  skills: string[];
  isVerified: boolean;
  joinedAt: number;
  lastActiveAt: number;
}

export function useBlockchain() {
  const [isConnected, setIsConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [userBounties] = useState<BountyData[]>([]);
  const [assignedBounties] = useState<BountyData[]>([]);
  const [reputationScore] = useState(0);
  const [developerProfile] = useState<DeveloperProfile | null>(null);

  const connectWallet = useCallback(async (): Promise<boolean> => {
    setIsInitializing(true);
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay to simulate connection
      
      // Mock successful connection
      setIsConnected(true);
      setWalletAddress('0x1234567890abcdef1234567890abcdef12345678');
      setBalance('125.45');
      
      Alert.alert('Success', 'Aptos wallet connected successfully!');
      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      Alert.alert('Error', 'Failed to connect to Aptos wallet. Please try again.');
      return false;
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const initializeWallet = async (): Promise<boolean> => {
    console.log('Mock: Initialize wallet');
    return connectWallet();
  };

  const createWallet = async () => {
    console.log('Mock: Create wallet');
    return null;
  };

  const createBounty = async (
    amount: string,
    repo: string,
    issueUrl: string,
    deadline: number
  ): Promise<string | null> => {
    console.log('Mock: Create bounty', { amount, repo, issueUrl, deadline });
    return null;
  };

  const assignBounty = async (bountyId: number, assignee: string): Promise<boolean> => {
    console.log('Mock: Assign bounty', { bountyId, assignee });
    return false;
  };

  const selfAssignBounty = async (bountyId: number): Promise<boolean> => {
    if (!isConnected) {
      Alert.alert('Wallet Required', 'Please connect your Aptos wallet first to claim this bounty.');
      return false;
    }
    
    setIsLoading(true);
    try {
      // Simulate bounty claiming process
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert('Success', 'Bounty claimed successfully! You can now start working on it.');
      return true;
    } catch (error) {
      console.error('Failed to claim bounty:', error);
      Alert.alert('Error', 'Failed to claim bounty. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const registerDeveloper = async (skills: string[]): Promise<boolean> => {
    console.log('Mock: Register developer', { skills });
    return false;
  };

  const submitRating = async (
    developer: string,
    bountyId: number,
    ratings: {
      codeQuality: number;
      communication: number;
      timeliness: number;
      reliability: number;
      feedback: string;
    }
  ): Promise<boolean> => {
    console.log('Mock: Submit rating', { developer, bountyId, ratings });
    return false;
  };

  const endorseSkill = async (developer: string, skill: string): Promise<boolean> => {
    console.log('Mock: Endorse skill', { developer, skill });
    return false;
  };

  const refreshData = async () => {
    console.log('Mock: Refresh data');
  };

  const disconnect = async () => {
    setIsConnected(false);
    setWalletAddress(null);
    setBalance('0');
    console.log('Wallet disconnected');
  };

  return {
    // State
    isConnected,
    isInitializing,
    walletAddress,
    balance,
    isLoading,
    userBounties,
    assignedBounties,
    reputationScore,
    developerProfile,
    
    // Actions
    connectWallet,
    initializeWallet,
    createWallet,
    createBounty,
    assignBounty,
    selfAssignBounty,
    registerDeveloper,
    submitRating,
    endorseSkill,
    refreshData,
    disconnect,
  };
}