import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { OwnedPassesSection } from "./OwnedPassesSection";
import { PriceSection } from "./PriceSection";

interface ButtonContentProps {
  error?: string;
  loading: boolean;
  price?: string;
  ownedNumber?: number;
}

export const ButtonContent = ({
  error,
  loading,
  price,
  ownedNumber,
}: ButtonContentProps) => {
  if (error) {
    return <ErrorState error={error} />;
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="flex items-center gap-3">
      {price && <PriceSection price={price} />}
      {ownedNumber !== undefined && (
        <OwnedPassesSection ownedNumber={ownedNumber} />
      )}
    </div>
  );
};
