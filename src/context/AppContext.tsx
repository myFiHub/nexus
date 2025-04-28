import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userService, UserProfile } from '../services/userService';
import { outpostService, ListOutpostsParams } from '../services/outpostService';
import { websocketService } from '../services/websocketService';
import walletService from "../services/walletService";
import transactionService from "../services/transactionService";

interface AppContextType {
    userProfile: UserProfile | null;
    loading: boolean;
    error: string | null;
    updateProfile: (profile: UserProfile) => Promise<void>;
    searchUsers: (text: string) => Promise<any>;
    followUser: (userUuid: string) => Promise<void>;
    getFollowers: (page?: number) => Promise<any>;
    listOutposts: (params: ListOutpostsParams) => Promise<any>;
    createOutpost: (params: any) => Promise<void>;
    updateOutpost: (params: any) => Promise<void>;
    joinOutpost: (uuid: string) => Promise<void>;
    inviteToOutpost: (params: any) => Promise<void>;
    walletState: {
        address: string | null;
        type: string | null;
        userInfo?: any;
    } | null;
    isConnected: boolean;
    isLoading: boolean;
    userPasses: any[];
    outposts: any[];
    connectWallet: (walletType?: string) => Promise<void>;
    disconnectWallet: () => Promise<void>;
    sendTransaction: (params: {
        transaction: any;
        chainId: string;
        metadata: {
            title: string;
            message: string;
            amount: string;
        };
    }) => Promise<string>;
    getTransactionStatus: (txHash: string) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [walletState, setWalletState] = useState<{
        address: string | null;
        type: string | null;
        userInfo?: any;
    } | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userPasses, setUserPasses] = useState<any[]>([]);
    const [outposts, setOutposts] = useState<any[]>([]);

    // Fetch user passes
    const fetchUserPasses = useCallback(async () => {
        try {
            if (!walletState?.address) return;
            const passes = await walletService.getUserPasses(walletState.address);
            setUserPasses(passes);
        } catch (error) {
            console.error('Error fetching user passes:', error);
            throw error;
        }
    }, [walletState?.address]);

    // Fetch outposts
    const fetchOutposts = useCallback(async () => {
        try {
            const outpostsData = await outpostService.listOutposts({});
            setOutposts(outpostsData);
        } catch (error) {
            console.error('Error fetching outposts:', error);
            throw error;
        }
    }, []);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    // Connect WebSocket
                    websocketService.connect(token);

                    // Load user profile
                    const profile = await userService.getProfile();
                    setUserProfile(profile);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        initializeApp();

        return () => {
            websocketService.disconnect();
        };
    }, []);

    useEffect(() => {
        const initWallet = async () => {
            try {
                await walletService.init();
                
                // Add listener for wallet state changes
                walletService.addListener((state) => {
                    setWalletState({
                        address: state.address,
                        type: state.walletType,
                    });
                    setIsConnected(state.isConnected);
                });
            } catch (error) {
                console.error("Error initializing wallet:", error);
                setError("Failed to initialize wallet");
            }
        };

        initWallet();
    }, []);

    // Fetch user passes and outposts when wallet is connected
    useEffect(() => {
        if (isConnected && walletState?.address) {
            fetchUserPasses();
            fetchOutposts();
        }
    }, [isConnected, walletState?.address, fetchUserPasses, fetchOutposts]);

    const updateProfile = async (profile: UserProfile) => {
        try {
            const updatedProfile = await userService.updateProfile(profile);
            setUserProfile(updatedProfile);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
            throw err;
        }
    };

    const searchUsers = async (text: string) => {
        try {
            return await userService.searchUsers({ text });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to search users');
            throw err;
        }
    };

    const followUser = async (userUuid: string) => {
        try {
            await userService.followUser(userUuid);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to follow user');
            throw err;
        }
    };

    const getFollowers = async (page?: number) => {
        try {
            return await userService.getFollowers({ page });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get followers');
            throw err;
        }
    };

    const listOutposts = async (params: ListOutpostsParams) => {
        try {
            return await outpostService.listOutposts(params);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to list outposts');
            throw err;
        }
    };

    const createOutpost = async (params: any) => {
        try {
            await outpostService.createOutpost(params);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create outpost');
            throw err;
        }
    };

    const updateOutpost = async (params: any) => {
        try {
            await outpostService.updateOutpost(params);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update outpost');
            throw err;
        }
    };

    const joinOutpost = async (uuid: string) => {
        try {
            await outpostService.addMember(uuid);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to join outpost');
            throw err;
        }
    };

    const inviteToOutpost = async (params: any) => {
        try {
            await outpostService.inviteUser(params);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to invite user');
            throw err;
        }
    };

    const connectWallet = async (walletType = "web3auth") => {
        try {
            setIsLoading(true);
            setError(null);

            let success = false;
            if (walletType === "web3auth") {
                success = await walletService.connectWeb3Auth();
            } else if (walletType === "nightly") {
                success = await walletService.connectNightlyWallet();
            }

            if (!success) {
                throw new Error("Failed to connect wallet");
            }
        } catch (error: any) {
            console.error("Error connecting wallet:", error);
            setError(error.message || "Failed to connect wallet");
        } finally {
            setIsLoading(false);
        }
    };

    const disconnectWallet = async () => {
        try {
            await walletService.disconnect();
        } catch (error: any) {
            console.error("Error disconnecting wallet:", error);
            setError(error.message || "Failed to disconnect wallet");
        }
    };

    const sendTransaction = async (params: {
        transaction: any;
        chainId: string;
        metadata: {
            title: string;
            message: string;
            amount: string;
        };
    }) => {
        try {
            setIsLoading(true);
            setError(null);

            const hash = await transactionService.sendTransaction(params);
            return hash;
        } catch (error: any) {
            console.error("Error sending transaction:", error);
            setError(error.message || "Failed to send transaction");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const getTransactionStatus = async (txHash: string) => {
        try {
            return await transactionService.getTransactionStatus(txHash);
        } catch (error: any) {
            console.error("Error getting transaction status:", error);
            setError(error.message || "Failed to get transaction status");
            throw error;
        }
    };

    return (
        <AppContext.Provider
            value={{
                userProfile,
                loading,
                error,
                updateProfile,
                searchUsers,
                followUser,
                getFollowers,
                listOutposts,
                createOutpost,
                updateOutpost,
                joinOutpost,
                inviteToOutpost,
                walletState,
                isConnected,
                isLoading,
                userPasses,
                outposts,
                connectWallet,
                disconnectWallet,
                sendTransaction,
                getTransactionStatus,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}; 