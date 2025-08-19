"use client";
import { assetsActions } from "app/containers/_assets/slice";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

export const RefreshBalanceButton = () => {
  const dispatch = useDispatch();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRefresh = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    dispatch(assetsActions.getBalance());

    setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isAnimating}
      className={` hover:bg-white/10 rounded transition-colors ${
        isAnimating ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      title="Refresh balance"
    >
      <RefreshCw
        className={`w-4 h-4 transition-transform duration-300 ${
          isAnimating ? "animate-spin" : "hover:rotate-180"
        }`}
      />
    </button>
  );
};
