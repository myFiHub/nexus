import { Loader } from "app/components/Loader";
import { OutpostModel } from "app/services/api/types";
import { AlertCircle, Users } from "lucide-react";
import { useSelector } from "react-redux";
import { AssetsSelectors } from "../../selectore";
import { PassSellerItem } from "./PassSellerItem";

export const UsersList = ({ outpost }: { outpost?: OutpostModel }) => {
  const passSellers = useSelector(
    AssetsSelectors.outpostPassSellers(outpost?.uuid)
  );
  const loadingPassSellers = useSelector(
    AssetsSelectors.outpostPassSellersLoading(outpost?.uuid)
  );
  const errorPassSellers = useSelector(
    AssetsSelectors.outpostPassSellersError(outpost?.uuid)
  );

  if (!outpost) return null;

  // Loading state
  if (loadingPassSellers) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <Loader className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground text-center">
          Loading available passes...
        </p>
      </div>
    );
  }

  // Error state
  if (errorPassSellers) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <AlertCircle className="w-8 h-8 text-destructive mb-4" />
        <p className="text-sm text-destructive text-center mb-2">
          Failed to load passes
        </p>
        <p className="text-xs text-muted-foreground text-center">
          {errorPassSellers}
        </p>
      </div>
    );
  }

  // No passes available
  if (!passSellers?.sellers || passSellers.sellers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <Users className="w-8 h-8 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground text-center">
          No passes available for this outpost
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="space-y-1">
        {passSellers.sellers.map((passSeller) => (
          <PassSellerItem
            key={passSeller.uuid}
            passSeller={passSeller}
            outpostId={outpost.uuid}
          />
        ))}
      </div>
    </div>
  );
};
