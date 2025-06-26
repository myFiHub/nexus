import { Button } from "app/components/Button";
import { GlobalSelectors } from "app/containers/global/selectors";
import { cn } from "app/lib/utils";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../selectors";
import { onGoingOutpostActions } from "../../slice";

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

  const isCheering = isCheeringAddress === address;
  const isBooing = isBooingAddress === address;

  if (!member) return null;

  const handleCheer = () => {
    if (!!isCheeringAddress) return;
    dispatch(onGoingOutpostActions.cheerBoo({ user: member, cheer: true }));
  };

  const handleBoo = () => {
    if (!!isBooingAddress) return;
    dispatch(onGoingOutpostActions.cheerBoo({ user: member, cheer: false }));
  };

  return cheer ? (
    <Button
      disabled={isCheering}
      onClick={handleCheer}
      size="xs"
      className={cn(
        "flex-1 flex items-center justify-center gap-1 p-2 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-600 rounded transition-colors",
        isCheering && "bg-green-500/10 hover:bg-green-500/20 text-green-600"
      )}
      title="Cheer"
    >
      {isCheering ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <img
          src="/cheer.png"
          alt="Cheer"
          className="w-4 h-4 brightness-0 saturate-100 invert-[0.4] sepia-100 saturate-1000 hue-rotate-[120deg]"
        />
      )}
    </Button>
  ) : isMyUser ? null : (
    <Button
      disabled={isBooing}
      onClick={handleBoo}
      size="xs"
      className={cn(
        "flex-1 flex items-center justify-center gap-1 p-2 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded transition-colors",
        isBooing && "bg-red-500/10 hover:bg-red-500/20 text-red-600"
      )}
      title="Boo"
    >
      {isBooing ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <img
          src="/boo.png"
          alt="Boo"
          className="w-4 h-4 brightness-0 saturate-100 invert-[0.4] sepia-100 saturate-1000 hue-rotate-[320deg]"
        />
      )}
    </Button>
  );
};
