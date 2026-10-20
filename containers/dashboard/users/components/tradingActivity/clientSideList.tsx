"use client";

import { useSelector } from "react-redux";
import { dashboardUsersSelectors } from "../../selectors";
import { TradeRow } from "./TradeRow";
import { gridCols } from "./classes";
import ListEndObserver from "./listEndObserver";

const Content = () => {
  const trades = useSelector(dashboardUsersSelectors.trades);
  return (
    <>
      {trades.map((trade, index) => (
        <TradeRow key={index} trade={trade} gridCols={gridCols} />
      ))}
      <ListEndObserver />
    </>
  );
};

const ClientSideList = () => {
  return (
    <>
      <Content />
    </>
  );
};

export default ClientSideList;
