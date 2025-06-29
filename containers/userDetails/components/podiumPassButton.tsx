"use client";

import { Button } from "app/components/Button";
import { buyOrSellPassDialog } from "app/containers/_assets/buyOrSellPassDialog";
import { AssetsSelectors } from "app/containers/_assets/selectore";
import { bigIntCoinToMoveOnAptos } from "app/lib/conversion";
import { User } from "app/services/api/types";
import { movementService } from "app/services/move/aptosMovement";
import { ReduxProvider } from "app/store/Provider";
import { Coins, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assetsActions, useAssetsSlice } from "../../_assets/slice";
import { GlobalSelectors } from "../../global/selectors";

const Content = ({ user }: { user: User }) => {
  useAssetsSlice();
  const dispatch = useDispatch();
  const loggedIn = useSelector(GlobalSelectors.isLoggedIn);
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const aptosAccount = useSelector(GlobalSelectors.aptosAccount);
  const pass = useSelector(AssetsSelectors.userPasses(user.aptos_address!));
  const sellingPass = useSelector(AssetsSelectors.sellingPass);
  const [gettingPrices, setGettingPrices] = useState(false);
  const loadingPass = useSelector(
    AssetsSelectors.userPassesLoading(user.aptos_address!)
  );
  const error = pass?.error;

  useEffect(() => {
    if (pass || !aptosAccount) {
      return;
    }
    dispatch(assetsActions.getUserPassInfo({ address: user.aptos_address! }));
  }, [user.aptos_address, aptosAccount]);

  if (!loggedIn || !myUser) {
    return <></>;
  }
  const alreadyOwnedNumber = pass?.ownedNumber ?? 0;

  const handleClick = async () => {
    if (error) {
      dispatch(assetsActions.getUserPassInfo({ address: user.aptos_address! }));
    } else {
      setGettingPrices(true);
      const callArray = [
        movementService.getPodiumPassPrice({
          sellerAddress: user.aptos_address!,
          numberOfTickets: 1,
        }),
      ] as any[];
      if (alreadyOwnedNumber > 0) {
        callArray.push(
          movementService.getTicketSellPriceForPodiumPass({
            sellerAddress: user.aptos_address!,
            numberOfTickets: 1,
          })
        );
      }
      let [price, sellPrice] = await Promise.all(callArray);
      const sellPriceInMove = sellPrice
        ? bigIntCoinToMoveOnAptos(sellPrice)
        : 0;

      setGettingPrices(false);
      const dialogResults = await buyOrSellPassDialog({
        user,
        alreadyOwnedNumber,
        buyPrice: price?.toString() ?? "0",
        sellPrice: sellPriceInMove.toString(),
      });
      if (dialogResults === "buy") {
        dispatch(assetsActions.buyPassFromUser({ user, numberOfTickets: 1 }));
      } else if (dialogResults === "sell") {
        dispatch(assetsActions.sellPass({ seller: user }));
      }
    }
  };
  const loading = gettingPrices || loadingPass || sellingPass;
  return (
    <div className="w-full sm:w-auto min-w-[280px]">
      <Button
        onClick={handleClick}
        disabled={loading}
        className="relative group overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl px-6 py-4 w-full sm:w-auto transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-0 min-w-[280px]"
      >
        {/* Animated background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />

        {/* Content container */}
        <div className="relative z-10 flex items-center justify-center gap-3">
          {error ? (
            <div key="error" className="flex items-center gap-2 text-red-200">
              <div>⚠️</div>
              <span className="text-sm font-medium">{error}</span>
            </div>
          ) : (
            <div key="content" className="flex items-center gap-3">
              {/* Loading state */}

              {loading && (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span className="text-sm">Loading...</span>
                </div>
              )}

              {/* Price section */}
              {pass?.price && !loading && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Coins className="w-4 h-4 text-yellow-300" />
                  <span className="text-lg font-bold text-white">
                    {pass.price}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-white/90">
                      MOVE
                    </span>
                    <div>
                      <Image
                        src="/movement_logo.svg"
                        alt="MOVE"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Owned passes section */}
              {pass?.ownedNumber !== undefined && !loading && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
                  <span className="text-sm font-medium text-white/90">
                    Owned:
                  </span>
                  <span className="text-sm font-medium text-white/90">
                    {pass.ownedNumber}{" "}
                    {pass.ownedNumber === 1 ? "pass" : "passes"}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Ripple effect on click */}
        <div className="absolute inset-0 bg-white/30 rounded-xl" />
      </Button>
    </div>
  );
};

export const PodiumPassButton = ({ user }: { user: User }) => {
  return (
    <ReduxProvider>
      <Content user={user} />
    </ReduxProvider>
  );
};
