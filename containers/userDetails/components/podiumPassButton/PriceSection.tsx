import { Coins } from "lucide-react";
import Image from "next/image";

interface PriceSectionProps {
  price: string;
}

export const PriceSection = ({ price }: PriceSectionProps) => {
  return (
    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
      <Coins className="w-4 h-4 text-yellow-300" />
      <span className="text-lg font-bold text-white">{price}</span>
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-white/90">MOVE</span>
        <div>
          <Image
            src="/movement_logo.svg"
            alt="MOVE"
            width={16}
            height={16}
            className="w-4 h-4"
          />
        </div>
      </div>
    </div>
  );
};
