import { useSelector } from "react-redux";
import { createOutpostSelectors } from "../../selectors";

export const SelectUserButton = () => {
  const selectedAccessType = useSelector(createOutpostSelectors.allowedToEnter);
  return <div> </div>;
};
