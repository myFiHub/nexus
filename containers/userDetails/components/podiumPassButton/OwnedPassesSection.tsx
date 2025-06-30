interface OwnedPassesSectionProps {
  ownedNumber: number;
}

export const OwnedPassesSection = ({
  ownedNumber,
}: OwnedPassesSectionProps) => {
  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
      <span className="text-sm font-medium text-white/90">Owned:</span>
      <span className="text-sm font-medium text-white/90">
        {ownedNumber} {ownedNumber === 1 ? "pass" : "passes"}
      </span>
    </div>
  );
};
