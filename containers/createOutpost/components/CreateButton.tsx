"use client";
import { LoginButton } from "app/components/header/LoginButton";
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

  const handleSubmit = () => {
    dispatch(createOutpostActions.submit());
  };

  if (!loggedIn) {
    return <LoginButton className="w-full max-w-[400px]" />;
  }
  return (
    <Button
      onClick={handleSubmit}
      type="submit"
      className="w-full max-w-[400px] bg-primary text-white rounded-lg px-4 py-3 text-base font-medium hover:bg-primary/90 transition-colors"
      disabled={loading}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
    </Button>
  );
};

export default CreateButton;
