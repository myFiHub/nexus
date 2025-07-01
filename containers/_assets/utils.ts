import { movementService } from "app/services/move/aptosMovement";

type PassPrices = any;
type PassDetails = any;

// Retry utility
const retry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error("retry", `Attempt ${i + 1} failed`, { error });
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  throw lastError;
};

// Calculate pass prices for a given amount
const calculatePassPrices = async (
  targetAddress: string,
  amount: number
): Promise<PassPrices> => {
  const startTime = performance.now();

  try {
    const supply = await retry(() =>
      movementService.getTotalSupply(targetAddress)
    );

    // Get current price with retry
    const singlePrice = await retry(() =>
      movementService.getPodiumPassPrice({
        sellerAddress: targetAddress,
      })
    );
    if (!singlePrice) {
      return undefined;
    }

    // Calculate buy/sell prices
    const buyPrice = singlePrice * amount;
    const sellPrice = singlePrice * amount;
    console.log("calculatePassPrices", "Basic prices calculated", {
      buyPrice,
      sellPrice,
    });

    // Get protocol fees with retry
    const { buyFee, sellFee, referralFee } = await retry(() =>
      podiumProtocol.getProtocolFees()
    );

    // Calculate fees
    const protocolFee = Math.floor((buyPrice * buyFee) / 10000);
    const subjectFee = Math.floor((buyPrice * sellFee) / 10000);
    const referralFeeAmount = Math.floor((buyPrice * referralFee) / 10000);

    const buyPriceWithFees =
      buyPrice + protocolFee + subjectFee + referralFeeAmount;
    const sellPriceWithFees = sellPrice - protocolFee - subjectFee;

    return {
      singlePrice,
      buyPrice,
      sellPrice,
      buyPriceWithFees,
      sellPriceWithFees,
      fees: {
        buy: {
          protocol: protocolFee,
          subject: subjectFee,
          referral: referralFeeAmount,
        },
        sell: { protocol: protocolFee, subject: subjectFee },
      },
    };
  } catch (error) {
    return undefined;
  }
};

export const getPassDetails = async (
  targetAddress: string,
  amount: number,
  metadata?: any
): Promise<PassDetails> => {
  const startTime = performance.now();

  try {
    // Get supply with retry
    const supply = await retry(() =>
      movementService.getTotalSupply(targetAddress)
    );

    // Calculate prices
    const prices = await calculatePassPrices(targetAddress, amount);

    // Get symbol from metadata or derive fallback
    let symbol = "";
    if (
      metadata &&
      typeof metadata.symbol === "string" &&
      metadata.symbol.length > 0
    ) {
      symbol = metadata.symbol;
    } else {
      symbol = `PODIUM-${targetAddress.slice(-4)}`;
    }

    const details = {
      symbol,
      prices,
      supply,
    };

    return details;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
