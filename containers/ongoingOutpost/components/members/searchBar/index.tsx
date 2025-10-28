import { onGoingOutpostSelectors } from "app/containers/ongoingOutpost/selectors";
import { onGoingOutpostActions } from "app/containers/ongoingOutpost/slice";
import { Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export const MembersSearchBar = () => {
  const dispatch = useDispatch();
  const membersSearchValue = useSelector(
    onGoingOutpostSelectors.membersSearchValue
  );

  const handleSearch = (value: string) => {
    if (!value) {
      dispatch(onGoingOutpostActions.setMembersSearchValue(undefined));
      return;
    }
    dispatch(onGoingOutpostActions.setMembersSearchValue(value));
  };

  const onClearSearch = () => {
    dispatch(onGoingOutpostActions.setMembersSearchValue(undefined));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearch(value);
  };

  return (
    <div className="relative w-full max-w-xs mx-auto mb-1   rounded-md">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
        <input
          type="text"
          value={membersSearchValue || ""}
          onChange={handleInputChange}
          placeholder="Search members..."
          className="w-full pl-2 pr-2 py-1.5 text-xs border border-border rounded-md bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition-all duration-200 placeholder:text-muted-foreground"
        />
        {membersSearchValue && (
          <button
            onClick={onClearSearch}
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
