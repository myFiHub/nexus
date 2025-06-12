"use client";

import { Button } from "app/components/Button";
import { AssetsSelectors } from "app/containers/_assets/selectore";
import { ReduxProvider } from "app/store/Provider";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assetsActions, useAssetsSlice } from "../../_assets/slice";
import { GlobalSelectors } from "../../global/selectors";

const Content = ({ address }: { address: string }) => {
  useAssetsSlice();
  const dispatch = useDispatch();
  const loggedIn = useSelector(GlobalSelectors.isLoggedIn);
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const aptosAccount = useSelector(GlobalSelectors.aptosAccount);
  const pass = useSelector(AssetsSelectors.userPasses(address));
  const loadingPass = useSelector(AssetsSelectors.userPassesLoading(address));
  const error =
    pass?.error || pass?.errorGettingPrice || pass?.errorGettingOwnedNumber;

  useEffect(() => {
    if (pass || !aptosAccount) {
      return;
    }
    dispatch(assetsActions.getUserPassInfo({ address }));
  }, [address, aptosAccount]);

  if (!loggedIn || !aptosAccount || !myUser) {
    return <></>;
  }

  const handleClick = () => {
    if (error) {
      dispatch(assetsActions.getUserPassInfo({ address }));
    }
  };

  return (
    <Button onClick={handleClick}>
      {error ? <div className="text-red-500">{error}</div> : ""}
      {!error && (
        <>
          {loadingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : ""}
          {pass?.price}
          {pass?.ownedNumber}
        </>
      )}
    </Button>
  );
};

export const PodiumPassButton = ({ address }: { address: string }) => {
  return (
    <ReduxProvider>
      <Content address={address} />
    </ReduxProvider>
  );
};
