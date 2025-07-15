"use client";

import { Button } from "app/components/Button";
import { podiumPassTradeDialog } from "app/components/Dialog";
import { loginPromptDialog } from "app/components/Dialog/loginPromptDialog";
import { AssetsSelectors } from "app/containers/_assets/selectore";
import { assetsActions } from "app/containers/_assets/slice";
import { GlobalSelectors } from "app/containers/global/selectors";
import podiumApi from "app/services/api";
import { User } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserInfoDisplay } from "./UserInfoDisplay";

const Content = ({ address }: { address: string }) => {
  const dispatch = useDispatch();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const loggedIn = !!myUser;
  const isBuyingPass = useSelector(AssetsSelectors.buyingPass);
  const isSellingPass = useSelector(AssetsSelectors.sellingPass);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isBuying, setIsBuying] = useState(false);
  const [isSelling, setIsSelling] = useState(false);

  const continueWithAction = async (type: "buy" | "sell", user: User) => {
    const res = await podiumPassTradeDialog({
      sellerUser: user,
      type,
    });
    if (!res?.confirmed) {
      return;
    }

    if (type === "buy") {
      dispatch(assetsActions.buyPassFromUser({ user, numberOfPasses: 1 }));
      return;
    }
    if (type === "sell") {
      dispatch(assetsActions.sellPass({ seller: user }));
      return;
    }
  };

  const handleClick = async (type: "buy" | "sell") => {
    let userResult: User | undefined = user;
    if (!user) {
      if (type === "buy") {
        setIsBuying(true);
      }
      if (type === "sell") {
        setIsSelling(true);
      }
      userResult = await podiumApi.getUserByAptosAddress(address);
      setUser(userResult);
    }
    if (!userResult) {
      return;
    }
    if (type === "buy") {
      setIsBuying(false);
    }
    if (type === "sell") {
      setIsSelling(false);
    }

    if (!loggedIn) {
      await loginPromptDialog({
        actionDescription: type === "buy" ? "buy this pass" : "sell this pass",
        additionalComponent: (
          <UserInfoDisplay
            user={userResult}
            actionType={type}
            className="mt-4"
          />
        ),
        action: () => continueWithAction(type, userResult),
      });
    } else {
      continueWithAction(type, userResult);
    }
  };

  const loadingBuy = isBuying || isBuyingPass;
  const loadingSell = isSelling || isSellingPass;
  const isMyUser = myUser?.aptos_address === address;
  if (isMyUser) {
    return null;
  }
  return (
    <div className="flex opacity-0 gap-1 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
      <Button
        className={`min-w-10 `}
        size="xxs"
        type="button"
        colorScheme="primary"
        onClick={() => handleClick("buy")}
        disabled={loadingBuy}
      >
        {loadingBuy ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buy"}
      </Button>
      <Button
        className={`min-w-10 `}
        size="xxs"
        type="button"
        colorScheme="danger"
        onClick={() => handleClick("sell")}
        disabled={loadingSell}
      >
        {loadingSell ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sell"}
      </Button>
    </div>
  );
};

export const UserCardActions = ({ address }: { address: string }) => {
  return (
    <ReduxProvider>
      <Content address={address} />
    </ReduxProvider>
  );
};
