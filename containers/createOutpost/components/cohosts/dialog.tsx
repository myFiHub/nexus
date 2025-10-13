"use client";

// Usage example:
//
// import { cohostsDialog } from "app/containers/createOutpost/components/cohosts/dialog";
//
// const handleSelectCohosts = async () => {
//   const result = await cohostsDialog({
//     title: "Select Cohosts"
//   });
//
//   if (result.confirmed) {
//     console.log("Cohosts dialog closed");
//   }
// };

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "app/components/Dialog";
import { Img } from "app/components/Img";
import { Input } from "app/components/Input";
import { Loader } from "app/components/Loader";
import { truncate } from "app/lib/utils";
import podiumApi from "app/services/api";
import { User } from "app/services/api/types";
import { motion } from "framer-motion";
import { Check, Search, Users as UsersIcon, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOutpostSelectors } from "../../selectors";
import { createOutpostActions } from "../../slice";

interface CohostsDialogProps {
  title?: ReactNode;
}

export type CohostsDialogResult = {
  confirmed: boolean;
};

let resolvePromise: ((value: CohostsDialogResult) => void) | null = null;

export const cohostsDialog = ({
  title = "Select Cohosts",
}: CohostsDialogProps = {}): Promise<CohostsDialogResult> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-cohosts-dialog", {
      detail: {
        title,
      },
    });
    window.dispatchEvent(event);
  });
};

export const CohostsDialogProvider = () => {
  const dispatch = useDispatch();
  const selectedCohosts = useSelector(createOutpostSelectors.cohostUsers) || [];

  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [dialogContent, setDialogContent] = useState<CohostsDialogProps | null>(
    null
  );

  // Search results
  const [usersResults, setUsersResults] = useState<Record<string, User>>({});

  useEffect(() => {
    const handleShowDialog = (event: CustomEvent<CohostsDialogProps>) => {
      setDialogContent(event.detail);
      setIsOpen(true);
    };

    window.addEventListener(
      "show-cohosts-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-cohosts-dialog",
        handleShowDialog as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (searchValue.length < 3) {
        setUsersResults({});
        return;
      }

      setIsSearching(true);
      try {
        const usersResult = await podiumApi.searchUserByName(searchValue);
        setUsersResults(usersResult);
      } catch (error) {
        console.error("Error searching users:", error);
        setUsersResults({});
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 500); // 500ms debounce
    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const handleClose = () => {
    setIsOpen(false);
    resolvePromise?.({ confirmed: true });
    resolvePromise = null;
    setSearchValue("");
    setUsersResults({});
  };

  const clearSearch = () => {
    setSearchValue("");
    setUsersResults({});
  };

  const handleToggleUser = (user: User) => {
    dispatch(createOutpostActions.toggleCohostUser(user));
  };

  const isUserSelected = (user: User) => {
    return selectedCohosts.some((u) => u.uuid === user.uuid);
  };

  const usersCount = Object.keys(usersResults).length;
  const selectedCount = selectedCohosts.length;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="w-full max-w-2xl min-h-[620px] max-h-[620px] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between">
              <span>{dialogContent?.title}</span>
              {selectedCount > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  {selectedCount} selected
                </span>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for users..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 pr-10"
            />
            {isSearching && (
              <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-spin" />
            )}
            {searchValue.length > 0 && !isSearching && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Selected Cohosts Section */}
        {selectedCount > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Selected Cohosts
            </h3>
            <div className="space-y-2 max-h-[150px] overflow-y-auto">
              {selectedCohosts.map((user) => (
                <motion.div
                  key={user.uuid}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-3 rounded-lg border border-primary/50 bg-primary/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Img
                        src={user.image}
                        alt={user.name || "placeholder"}
                        className="w-10 h-10 rounded-full border-2 border-primary"
                        useImgTag
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-sm">
                        {user.name || "Anonymous User"}
                      </h4>
                      {user.uuid && (
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {truncate(user.uuid)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleUser(user)}
                      className="p-1 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground sticky top-0 bg-background py-2 z-2">
            {usersCount > 0
              ? `Search Results (${usersCount})`
              : "Search Results"}
          </h3>

          {Object.values(usersResults).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UsersIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>
                {searchValue.length < 3
                  ? "Type at least 3 characters to search"
                  : "No users found"}
              </p>
            </div>
          ) : (
            Object.values(usersResults).map((user, index) => {
              const isSelected = isUserSelected(user);

              return (
                <motion.div
                  key={user.uuid}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <button
                    onClick={() => handleToggleUser(user)}
                    className={`w-full p-4 rounded-lg border transition-all duration-200 group ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-accent/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Img
                          src={user.image}
                          alt={user.name || "placeholder"}
                          className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                            isSelected
                              ? "border-primary"
                              : "border-border group-hover:border-primary/50"
                          }`}
                          useImgTag
                        />
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <h4
                          className={`font-semibold transition-colors ${
                            isSelected
                              ? "text-primary"
                              : "text-foreground group-hover:text-primary"
                          }`}
                        >
                          {user.name || "Anonymous User"}
                        </h4>
                        {user.aptos_address && (
                          <p className="text-[12px] text-muted-foreground font-mono">
                            {truncate(user.aptos_address)}
                          </p>
                        )}
                        {user.uuid && (
                          <p className="text-[12px] text-muted-foreground font-mono">
                            {truncate(user.uuid)}
                          </p>
                        )}
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/30 group-hover:border-primary/50"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
