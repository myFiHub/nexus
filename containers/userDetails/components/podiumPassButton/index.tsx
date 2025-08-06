"use client";

import { Button } from "app/components/Button";
import { buyOrSellPassDialog } from "app/containers/_assets/buyOrSellPassDialog";
import { AssetsSelectors } from "app/containers/_assets/selectore";
import { bigIntCoinToMoveOnAptos } from "app/lib/conversion";
import { User } from "app/services/api/types";
import { movementService } from "app/services/move/aptosMovement";
import { ReduxProvider } from "app/store/Provider";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assetsActions, useAssetsSlice } from "../../../_assets/slice";
import { GlobalSelectors } from "../../../global/selectors";
import { ButtonContent } from "./ButtonContent";
import { PulsingShadow } from "./PulsingShadow";
import { ShimmerEffect } from "./ShimmerEffect";
import { Sparkles } from "./Sparkles";

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
    if (pass || !myUser) {
      return;
    }
    dispatch(assetsActions.getUserPassInfo({ address: user.aptos_address! }));
  }, [user.aptos_address, myUser?.aptos_address]);

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
          movementService.getSellPriceForPodiumPass({
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
        dispatch(assetsActions.buyPassFromUser({ user, numberOfPasses: 1 }));
      } else if (dialogResults === "sell") {
        dispatch(assetsActions.sellPass({ seller: user }));
      }
    }
  };
  const loading = gettingPrices || loadingPass || !!sellingPass;
  return (
    <div className="w-full sm:w-auto min-w-[330px]">
      <PulsingShadow>
        <Sparkles />

        <Button
          onClick={handleClick}
          disabled={loading}
          className="relative group overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl px-6 py-4 w-full sm:w-auto transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-0 min-w-[330px]"
        >
          <ShimmerEffect />

          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />

          {/* Content container */}
          <div className="relative z-10 flex items-center justify-center gap-3">
            <ButtonContent
              error={error}
              loading={loading}
              price={pass?.price}
              ownedNumber={pass?.ownedNumber}
            />
          </div>

          {/* Ripple effect on click */}
          <div className="absolute inset-0 bg-white/30 rounded-xl" />
        </Button>
      </PulsingShadow>
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
