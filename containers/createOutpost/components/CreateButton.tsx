"use client";
import { LoginButton } from "app/components/header/LoginButton";
import { BuyableTicketTypes } from "app/components/outpost/types";
import { GlobalSelectors } from "app/containers/global/selectors";
import { Loader2 } from "lucide-react";
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
  if (
    allFields.enter_type === BuyableTicketTypes.onlyPodiumPassHolders &&
    allFields.tickets_to_enter.length === 0
  ) {
    thereAreThingsToDo = true;
  }
  if (
    allFields.speak_type === BuyableTicketTypes.onlyPodiumPassHolders &&
    allFields.tickets_to_speak.length === 0
  ) {
    thereAreThingsToDo = true;
  }
  if (isScheduled && !allFields.scheduled_for) {
    thereAreThingsToDo = true;
  }
  if (!allFields.name || allFields.name?.length < 4) {
    thereAreThingsToDo = true;
  }

  const handleSubmit = () => {
    dispatch(createOutpostActions.submit());
  };

  if (!loggedIn) {
    return <LoginButton className="w-full max-w-[400px]" />;
  }
  const disabled = loading || thereAreThingsToDo;
  return (
    <Button
      onClick={handleSubmit}
      type="submit"
      className="w-full max-w-[400px] bg-primary text-white rounded-lg px-4 py-3 text-base font-medium hover:bg-primary/90 transition-colors"
      disabled={disabled}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
    </Button>
  );
};

export default CreateButton;
