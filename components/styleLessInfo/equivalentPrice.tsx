"use client";
import { GlobalSelectors } from "app/containers/global/selectors";
import { ReduxProvider } from "app/store/Provider";
import { useSelector } from "react-redux";

const Content = ({ amountInMove }: { amountInMove: number }) => {
  const usdValue = useSelector(GlobalSelectors.moveToUsd(amountInMove));
  return <>{usdValue}</>;
};

export const EquivalentPrice_StyleLess = ({
  amountInMove,
}: {
  amountInMove: number;
}) => {
  return (
    <ReduxProvider>
      <Content amountInMove={amountInMove} />
    </ReduxProvider>
  );
};
