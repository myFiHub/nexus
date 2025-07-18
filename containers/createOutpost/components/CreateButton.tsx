"use client";
import { LoginButton } from "app/components/header/LoginButton";
import { Loader } from "app/components/Loader";
import { BuyableTicketTypes } from "app/components/outpost/types";
import { GlobalSelectors } from "app/containers/global/selectors";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../components/Button";
import { createOutpostSelectors } from "../selectors";
import { createOutpostActions } from "../slice";

const CreateButton = () => {
  const dispatch = useDispatch();
  const loading = useSelector(createOutpostSelectors.isCreating);
  const loggedIn = !!useSelector(GlobalSelectors.podiumUserInfo);
  const isScheduled = useSelector(createOutpostSelectors.scheduled);
  const allFields = useSelector(createOutpostSelectors.allFields);
  let thereAreThingsToDo = false;
  const trimmedName = allFields.name?.trim();
  // checking pass for entering
  let buttonText = "Create";
  if (
    allFields.enter_type === BuyableTicketTypes.onlyPodiumPassHolders &&
    allFields.tickets_to_enter.length === 0
  ) {
    thereAreThingsToDo = true;
    buttonText = "Select users to buy Pass from to enter";
  }
  // checking pass for speaking
  if (
    allFields.speak_type === BuyableTicketTypes.onlyPodiumPassHolders &&
    allFields.tickets_to_speak.length === 0
  ) {
    thereAreThingsToDo = true;
    buttonText = "Select users to buy Pass from to speak";
  }
  // checking if scheduled
  if (isScheduled && !allFields.scheduled_for) {
    thereAreThingsToDo = true;
    buttonText = "Select date and time";
  }
  // checking if name is valid
  if (!trimmedName || trimmedName?.length < 4) {
    thereAreThingsToDo = true;
    buttonText = "Enter a valid name";
  }

  // checking if luma is enabled and there is no guests
  if (allFields.enabled_luma && allFields.luma_hosts.length === 0) {
    thereAreThingsToDo = true;
    buttonText = "Add Hosts for Luma event";
  }

  const handleSubmit = () => {
    dispatch(createOutpostActions.submit());
  };

  if (!loggedIn) {
    return <LoginButton className="w-full " />;
  }
  const disabled = loading || thereAreThingsToDo;
  return (
    <>
      <Button
        onClick={handleSubmit}
        type="submit"
        className="w-full  bg-primary text-white rounded-lg px-4 py-3 text-base font-medium hover:bg-primary/90 transition-colors"
        disabled={disabled}
      >
        {loading ? <Loader className="w-4 h-4 animate-spin" /> : "Create"}
      </Button>
      {
        <div className="text-red-500 text-sm h-4  text-center">
          {buttonText !== "Create" ? buttonText : ""}
        </div>
      }
    </>
  );
};

export default CreateButton;
