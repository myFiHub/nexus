"use client";

import { ReduxProvider } from "app/store/Provider";
import { useSelector } from "react-redux";
import { dashboardUsersSelectors } from "../../selectors";
import { TradeRow } from "./TradeRow";
import { gridCols } from "./classes";
import ListEndObserver from "./listEndObserver";

const Content = () => {
  const trades = useSelector(dashboardUsersSelectors.trades);
  return (
    <>
      {trades.map((trade) => (
        <TradeRow key={trade.uuid} trade={trade} gridCols={gridCols} />
      ))}
      <ListEndObserver />
    </>
  );
};

const ClientSideList = () => {
  return (
    <ReduxProvider>
      <Content />
    </ReduxProvider>
  );
};

export default ClientSideList;
