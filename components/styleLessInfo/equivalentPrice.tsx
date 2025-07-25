"use client";
import { GlobalSelectors } from "app/containers/global/selectors";
import { ReduxProvider } from "app/store/Provider";
import { useSelector } from "react-redux";

const Content = ({
  amountInMove,
  decimalPlaces = 2,
}: {
  amountInMove: number;
  decimalPlaces?: number;
}) => {
  const usdValue = useSelector(GlobalSelectors.moveToUsd(amountInMove));
  return <>{Number(usdValue).toFixed(decimalPlaces)}</>;
};

export const EquivalentPrice_StyleLess = ({
  amountInMove,
  decimalPlaces = 2,
}: {
  amountInMove: number;
  decimalPlaces?: number;
}) => {
  return (
    <ReduxProvider>
      <Content amountInMove={amountInMove} decimalPlaces={decimalPlaces} />
    </ReduxProvider>
  );
};
