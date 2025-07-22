import { AssetsSelectors } from "app/containers/_assets/selectore";
import { cn } from "app/lib/utils";
import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { useSelector } from "react-redux";

const BalanceDisplay = ({
  className,
  loadingClassName,
}: {
  className?: string;
  loadingClassName?: string;
}) => {
  const balance = useSelector(AssetsSelectors.balance);
  const isLoading = useSelector(AssetsSelectors.balance).loading;
  const value =
    typeof balance?.value === "number"
      ? balance.value
      : parseFloat(balance?.value ?? "0");
  // Determine decimals (up to 8)
  let decimals = 0;
  if (typeof balance?.value === "string" && balance.value.includes(".")) {
    decimals = Math.min(8, balance.value.split(".")[1]?.length || 0);
  } else if (typeof value === "number") {
    const valueStr = value.toString();
    if (valueStr.includes(".")) {
      decimals = Math.min(8, valueStr.split(".")[1]?.length || 0);
    }
  }

  const [prevValue, setPrevValue] = useState(value);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (prevValue !== value) {
      setPrevValue(value);
      isInitialLoad.current = false;
    }
  }, [value, prevValue]);

  return isLoading ? (
    <div
      className={cn(
        "h-8 w-32 bg-primary-foreground/20 animate-pulse rounded mt-1",
        loadingClassName
      )}
    />
  ) : (
    <div
      className={cn("text-3xl font-bold text-foreground mt-1 h-8", className)}
    >
      <CountUp
        end={value ?? 0}
        start={isInitialLoad.current ? value : undefined}
        duration={1}
        separator=","
        decimals={decimals}
        key={prevValue}
      />{" "}
      MOVE
    </div>
  );
};

export default BalanceDisplay;
