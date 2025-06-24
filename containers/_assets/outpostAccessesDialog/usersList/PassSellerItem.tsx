import { Button } from "app/components/Button";
import { Img } from "app/components/Img";
import { Check, DoorOpen, Loader2, Mic } from "lucide-react";
import { useDispatch } from "react-redux";
import { assetsActions, PassSeller } from "../../slice";

interface PassSellerItemProps {
  passSeller: PassSeller;
  outpostId: string;
}

export const PassSellerItem = ({
  passSeller,
  outpostId,
}: PassSellerItemProps) => {
  const dispatch = useDispatch();

  const handleBuyClick = () => {
    if (!passSeller.bought && !passSeller.buying) {
      // Update the pass seller to show loading state
      dispatch(
        assetsActions.updateOutpostPassSeller({
          outpostId,
          pass: { ...passSeller, buying: true },
        })
      );

      // Use the userInfo from the pass seller
      dispatch(
        assetsActions.buyPassFromUser({
          user: passSeller.userInfo,
          numberOfTickets: 1,
        })
      );
    }
  };

  const renderActionButton = () => {
    // State 1: Loading
    if (passSeller.buying) {
      return (
        <Button size="sm" variant="outline" disabled className="min-w-[80px]">
          <Loader2 className="w-4 h-4 animate-spin" />
        </Button>
      );
    }

    // State 2: Bought (show tick icon, green)
    if (passSeller.bought) {
      return (
        <Button
          size="sm"
          variant="outline"
          disabled
          className="min-w-[80px] text-green-600 border-green-600"
        >
          <Check className="w-4 h-4" />
        </Button>
      );
    }

    // States 3-5: Based on accessIfIBuy
    const getAccessIcon = () => {
      switch (passSeller.accessIfIBuy) {
        case "speak":
          return <Mic className="w-4 h-4" />;
        case "enter":
          return <DoorOpen className="w-4 h-4" />;
        case "enterAndSpeak":
          return (
            <div className="flex items-center gap-1">
              <DoorOpen className="w-3 h-3" />
              <Mic className="w-3 h-3" />
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <Button
        size="sm"
        variant="outline"
        onClick={handleBuyClick}
        className="min-w-[80px]"
      >
        {getAccessIcon()}
      </Button>
    );
  };

  const getAccessText = () => {
    switch (passSeller.accessIfIBuy) {
      case "speak":
        return "Speak";
      case "enter":
        return "Enter";
      case "enterAndSpeak":
        return "Enter & Speak";
      default:
        return "";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-border last:border-b-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <Img
            src={passSeller.image}
            alt={passSeller.name}
            className="w-10 h-10 rounded-full"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm truncate">{passSeller.name}</h4>
            {passSeller.bought && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Owned
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{getAccessText()}</span>
            <span>•</span>
            <span className="font-medium">{passSeller.price} MOVE</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex-shrink-0 ml-4">{renderActionButton()}</div>
    </div>
  );
};
