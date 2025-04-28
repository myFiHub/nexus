import podiumProtocol from './podiumProtocol';

export interface OutpostData {
    owner: string;
    name: string;
    description: string;
    uri: string;
    price: number;
    feeShare: number;
    emergencyPause: boolean;
    maxTiers: number;
    tierCount: number;
}

export interface SubscriptionTier {
    name: string;
    price: number;
    duration: number;
}

export interface Subscription {
    tierId: number;
    startTime: number;
    endTime: number;
}

class OutpostContractService {
    // Get all outposts from the smart contract
    async getAllOutposts(): Promise<OutpostData[]> {
        try {
            const outposts = await podiumProtocol.getOutposts();
            return outposts.map(this.parseOutpostData);
        } catch (error) {
            console.error('Failed to fetch outposts:', error);
            throw error;
        }
    }

    // Get a specific outpost by address
    async getOutpost(outpostAddress: string): Promise<OutpostData> {
        try {
            const outpost = await podiumProtocol.getOutpost(outpostAddress);
            return this.parseOutpostData(outpost);
        } catch (error) {
            console.error('Failed to fetch outpost:', error);
            throw error;
        }
    }

    // Create a new outpost
    async createOutpost(
        creatorAddress: string,
        name: string,
        description: string,
        uri: string,
        wallet?: any
    ): Promise<string> {
        try {
            return await podiumProtocol.createOutpost(
                creatorAddress,
                name,
                description,
                uri,
                wallet
            );
        } catch (error) {
            console.error('Failed to create outpost:', error);
            throw error;
        }
    }

    // Get subscription details
    async getSubscription(
        subscriberAddress: string,
        outpostAddress: string
    ): Promise<Subscription | null> {
        try {
            const subscription = await podiumProtocol.getSubscription(
                subscriberAddress,
                outpostAddress
            );
            if (!subscription) return null;
            
            return {
                tierId: Number(subscription.tierId),
                startTime: Number(subscription.startTime),
                endTime: Number(subscription.endTime)
            };
        } catch (error) {
            console.error('Failed to fetch subscription:', error);
            throw error;
        }
    }

    // Get subscription tier details
    async getSubscriptionTier(
        outpostAddress: string,
        tierId: number
    ): Promise<SubscriptionTier | null> {
        try {
            const tier = await podiumProtocol.getSubscriptionTier(
                outpostAddress,
                tierId
            );
            if (!tier) return null;
            
            return {
                name: String(tier.name),
                price: Number(tier.price),
                duration: Number(tier.duration)
            };
        } catch (error) {
            console.error('Failed to fetch subscription tier:', error);
            throw error;
        }
    }

    // Subscribe to an outpost
    async subscribe(
        subscriberAddress: string,
        outpostAddress: string,
        tierId: number,
        referrerAddress: null | undefined = null,
        wallet?: any
    ): Promise<string> {
        try {
            return await podiumProtocol.subscribe(
                subscriberAddress,
                outpostAddress,
                tierId,
                referrerAddress,
                wallet
            );
        } catch (error) {
            console.error('Failed to subscribe:', error);
            throw error;
        }
    }

    // Cancel subscription
    async cancelSubscription(
        subscriberAddress: string,
        outpostAddress: string,
        wallet?: any
    ): Promise<string> {
        try {
            return await podiumProtocol.cancelSubscription(
                subscriberAddress,
                outpostAddress,
                wallet
            );
        } catch (error) {
            console.error('Failed to cancel subscription:', error);
            throw error;
        }
    }

    // Verify subscription
    async verifySubscription(
        subscriberAddress: string,
        outpostAddress: string,
        tierId: number
    ): Promise<boolean> {
        try {
            const isValid = await podiumProtocol.verifySubscription(
                subscriberAddress,
                outpostAddress,
                tierId
            );
            return Boolean(isValid);
        } catch (error) {
            console.error('Failed to verify subscription:', error);
            throw error;
        }
    }

    // Add type guard as a private static method
    private static isValidProtocolFees(fees: any): fees is { 
        buyFee: number; 
        sellFee: number; 
        referralFee: number; 
    } {
        return (
            typeof fees === 'object' &&
            typeof fees.buyFee === 'number' &&
            typeof fees.sellFee === 'number' &&
            typeof fees.referralFee === 'number'
        );
    }

    // Get protocol fees
    async getProtocolFees(): Promise<{
        passFee: number;
        subscriptionFee: number;
        referrerFee: number;
    }> {
        try {
            const fees = await podiumProtocol.getProtocolFees();
            if (!OutpostContractService.isValidProtocolFees(fees)) {
                throw new Error('Invalid protocol fees response');
            }
            return {
                passFee: Number(fees.buyFee),
                subscriptionFee: Number(fees.sellFee),
                referrerFee: Number(fees.referralFee)
            };
        } catch (error) {
            console.error('Failed to fetch protocol fees:', error);
            throw error;
        }
    }

    private parseOutpostData(data: any): OutpostData {
        return {
            owner: String(data.owner),
            name: String(data.name),
            description: String(data.description),
            uri: String(data.uri),
            price: Number(data.price),
            feeShare: Number(data.feeShare),
            emergencyPause: Boolean(data.emergencyPause),
            maxTiers: Number(data.maxTiers),
            tierCount: Number(data.tierCount)
        };
    }
}

export const outpostContractService = new OutpostContractService(); 