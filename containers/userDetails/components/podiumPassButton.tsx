"use client";

import { Button } from "app/components/Button";
import { AssetsSelectors } from "app/containers/_assets/selectore";
import { User } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
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

  const handleClick = () => {
    if (error) {
      dispatch(assetsActions.getUserPassInfo({ address: user.aptos_address! }));
    } else {
      dispatch(assetsActions.buyPassFromUser({ user, numberOfTickets: 1 }));
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loadingPass}
      className="flex flex-wrap items-center justify-center gap-2 px-4 py-2.5 w-full sm:w-auto hover:bg-opacity-90 transition-all cursor-pointer content-center"
    >
      {error ? <div className="text-red-500">{error}</div> : ""}
      {!error && (
        <>
          {loadingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : ""}
          {pass?.price && (
            <div className="flex items-center gap-1.5 text-base sm:text-lg font-medium">
              <span className="text-green-500">price: {pass.price} MOVE</span>
              <Image
                src="/movement_logo.svg"
                alt="MOVE"
                width={20}
                height={20}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            </div>
          )}
          {pass?.ownedNumber !== undefined && (
            <div className="text-xs sm:text-sm text-gray-400 border-l pl-2 sm:pl-3">
              {pass.ownedNumber} {pass.ownedNumber === 1 ? "pass" : "passes"}{" "}
              owned
            </div>
          )}
        </>
      )}
    </Button>
  );
};

export const PodiumPassButton = ({ user }: { user: User }) => {
  return (
    <ReduxProvider>
      <Content user={user} />
    </ReduxProvider>
  );
};
