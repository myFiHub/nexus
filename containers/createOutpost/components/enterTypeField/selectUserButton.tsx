import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { userSelectDialog } from "app/components/Dialog/userSelectDialog";
import { BuyableTicketTypes } from "app/components/outpost/types";
import { isDev } from "app/lib/utils";
import { User } from "app/services/api/types";
import { RootState } from "app/store";
import { useDispatch, useSelector } from "react-redux";

export const SelectUserButton = ({
  typeSelector,
  sellerSelector,
  actionToCallOnDone,
}: {
  typeSelector: (store: RootState) => string;
  sellerSelector: (store: RootState) => { [uuid: string]: User };
  actionToCallOnDone: ActionCreatorWithPayload<{
    [uuid: string]: User;
  }>;
}) => {
  const selectedEnterType = useSelector(typeSelector);
  const dispatch = useDispatch();
  const passSellersRequiredToEnter = useSelector(sellerSelector);
  const numberOfPassSellersRequired = Object.keys(
    passSellersRequiredToEnter
  ).length;
  if (selectedEnterType !== BuyableTicketTypes.onlyPodiumPassHolders) {
    return <></>;
  }
  const handleClick = async () => {
    const result = await userSelectDialog({
      title: "Select Users",
      onUserToggled: (user, isSelected) => {
        if (isDev) {
          console.log(`${user.name} ${isSelected ? "selected" : "deselected"}`);
        }
      },
      selectedUsers: passSellersRequiredToEnter, // Optional: pre-selected users
    });

    if (result.confirmed) {
      dispatch(actionToCallOnDone(result.selectedUsers));
    }
  };
  return (
    <div
      onClick={handleClick}
      className={`absolute bottom-[7px] w-[170px] right-3 h-8 rounded-[5px] center text-white font-medium text-sm cursor-pointer flex items-center gap-1 justify-center ${
        numberOfPassSellersRequired === 0
          ? "border-1 border-red-500"
          : "border-1 border-green-300"
      }`}
    >
      {numberOfPassSellersRequired === 0 ? (
        <>
          Select users <span className="text-red-400">(required)</span>
        </>
      ) : (
        `${numberOfPassSellersRequired} selected`
      )}
    </div>
  );
};
