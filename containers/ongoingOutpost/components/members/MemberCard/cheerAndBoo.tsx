import { Button } from "app/components/Button";
import { Loader } from "app/components/Loader";
import { GlobalSelectors } from "app/containers/global/selectors";
import { toast } from "app/lib/toast";
import { cn } from "app/lib/utils";
import { wsClient } from "app/services/wsClient";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../../selectors";
import { onGoingOutpostActions } from "../../../slice";
import { assetsActions } from "app/containers/_assets/slice";

export const CheerAndBoo = ({
  cheer,
  address,
}: {
  cheer: boolean;
  address: string;
}) => {
  const dispatch = useDispatch();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const isMyUser = address === myUser?.address;
  const member = useSelector(onGoingOutpostSelectors.member(address));
  const isCheeringAddress = useSelector(
    onGoingOutpostSelectors.isCheeringAddress
  );
  const isBooingAddress = useSelector(onGoingOutpostSelectors.isBooingAddress);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const isCheering = isCheeringAddress === address;
  const isBooing = isBooingAddress === address;

  if (!member) return null;

  const handleCheer = async () => {
    if (!!isCheeringAddress) return;
    setCheckingHealth(true);
    const isHealthy = await wsClient.healthCheck();
    if (!isHealthy) {
      setCheckingHealth(false);
      toast.error("Please check your internet connection and try again.");
      return;
    }
    setCheckingHealth(false);
    dispatch(onGoingOutpostActions.cheerBoo({ user: member, cheer: true }));
  };

  const handleBoo = async () => {
    if (!!isBooingAddress) return;
    setCheckingHealth(true);
    const isHealthy = await wsClient.healthCheck();
    if (!isHealthy) {
      setCheckingHealth(false);
      toast.error("Please check your internet connection and try again.");
      return;
    }
    setCheckingHealth(false);
    dispatch(assetsActions.getBalance());
    dispatch(onGoingOutpostActions.cheerBoo({ user: member, cheer: false }));
  };

  const loadingCheer = isCheering || checkingHealth;
  const loadingBoo = isBooing || checkingHealth;

  return cheer ? (
    <Button
      disabled={loadingCheer}
      onClick={handleCheer}
      size="xs"
      className={cn(
        "flex-1 flex items-center justify-center gap-1 p-2 text-xs bg-green-500/60 hover:bg-green-500/80 text-green-600 rounded transition-colors",
        isCheering && "bg-green-500/60 hover:bg-green-500/20 text-green-600"
      )}
      title="Cheer"
    >
      {loadingCheer ? (
        <Loader className="w-3 h-3 animate-spin" />
      ) : (
        <Image
          src="/cheer.png"
          alt="Cheer"
          width={16}
          height={16}
          className="w-4 h-4 brightness-0  filter   invert drop-shadow-lg"
        />
      )}
    </Button>
  ) : isMyUser ? null : (
    <Button
      disabled={loadingBoo}
      onClick={handleBoo}
      size="xs"
      className={cn(
        "flex-1 flex items-center justify-center gap-1 p-2 text-xs bg-red-500/60 hover:bg-red-500/80 text-red-600 rounded transition-colors",
        isBooing && "bg-red-500/60 hover:bg-red-500/20 text-red-600"
      )}
      title="Boo"
    >
      {loadingBoo ? (
        <Loader className="w-3 h-3 animate-spin" />
      ) : (
        <Image
          src="/boo.png"
          alt="Boo"
          width={16}
          height={16}
          className="w-4 h-4   filter brightness-0 invert drop-shadow-lg"
        />
      )}
    </Button>
  );
};
