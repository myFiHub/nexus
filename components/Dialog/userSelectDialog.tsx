"use client";

// Usage example:
//
// import { userSelectDialog } from "app/components/Dialog";
//
// const handleSelectUsers = async () => {
//   const result = await userSelectDialog({
//     title: "Select Users",
//     content: "Choose users to invite:",
//     onUserToggled: (user, isSelected) => {
//       console.log(`${user.name} ${isSelected ? 'selected' : 'deselected'}`);
//     },
//     selectedUsers: {}, // Optional: pre-selected users
//     confirmOpts: { text: "Invite" },
//     cancelOpts: { text: "Cancel" }
//   });
//
//   if (result.confirmed) {
//     console.log("Selected users:", result.selectedUsers);
//   }
// };

import { Img } from "app/components/Img";
import podiumApi from "app/services/api";
import { User } from "app/services/api/types";
import { RootState } from "app/store";
import { Check, Loader2, Search, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../Button";
import { Input } from "../Input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./index";

interface UserSelectDialogProps {
  title: ReactNode;
  onUserToggled: (user: User, isSelected: boolean) => void;
  selectedUsers?: Record<string, User>;
}

export type UserSelectDialogResult = {
  confirmed: boolean;
  selectedUsers: Record<string, User>;
};

let resolvePromise: ((value: UserSelectDialogResult) => void) | null = null;

export const userSelectDialog = ({
  title,
  onUserToggled,
  selectedUsers = {},
}: UserSelectDialogProps): Promise<UserSelectDialogResult> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;

    const event = new CustomEvent("show-user-select-dialog", {
      detail: {
        title,
        onUserToggled,
        selectedUsers,
      },
    });
    window.dispatchEvent(event);
  });
};

export const UserSelectDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Record<string, User>>({});
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Record<string, User>>({});
  const [dialogContent, setDialogContent] =
    useState<UserSelectDialogProps | null>(null);

  const myUser = useSelector((state: RootState) => state.global.podiumUserInfo);

  useEffect(() => {
    const handleShowDialog = (event: CustomEvent<UserSelectDialogProps>) => {
      setDialogContent(event.detail);
      setSelectedUsers(event.detail.selectedUsers || {});
      setIsOpen(true);
    };

    window.addEventListener(
      "show-user-select-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-user-select-dialog",
        handleShowDialog as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchValue.length < 3) {
        setSearchResults({});
        return;
      }

      setIsSearching(true);
      try {
        const results = await podiumApi.searchUserByName(searchValue);
        // Filter out my user from search results
        const filteredResults = Object.fromEntries(
          Object.entries(results).filter(([uuid]) => uuid !== myUser?.uuid)
        );
        setSearchResults(filteredResults);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults({});
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 500); // Increased debounce to 500ms
    return () => clearTimeout(timeoutId);
  }, [searchValue, myUser?.uuid]);

  const handleUserToggle = (user: User) => {
    const isSelected = !!selectedUsers[user.uuid];
    const newSelectedUsers = { ...selectedUsers };

    if (isSelected) {
      delete newSelectedUsers[user.uuid];
    } else {
      newSelectedUsers[user.uuid] = user;
    }

    setSelectedUsers(newSelectedUsers);
    dialogContent?.onUserToggled(user, !isSelected);
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise?.({ confirmed: true, selectedUsers });
    resolvePromise = null;
    setSearchValue("");
    setSearchResults({});
    setSelectedUsers({});
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.({ confirmed: false, selectedUsers: {} });
    resolvePromise = null;
    setSearchValue("");
    setSearchResults({});
    setSelectedUsers({});
  };

  const clearSearch = () => {
    setSearchValue("");
    setSearchResults({});
  };

  const allUsers = {
    ...Object.fromEntries(
      Object.entries(dialogContent?.selectedUsers || {}).filter(
        ([uuid]) => uuid !== myUser?.uuid
      )
    ),
    ...Object.fromEntries(
      Object.entries(searchResults).filter(([uuid]) => uuid !== myUser?.uuid)
    ),
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // When dialog is closed (by clicking outside, pressing escape, etc.), treat as confirm
          handleConfirm();
        }
      }}
    >
      <DialogContent className="max-w-md min-h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{dialogContent?.title}</DialogTitle>
        </DialogHeader>

        {/* Search Input - Moved to top */}
        <div className="mb-4 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchValue && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Users List - Fixed height with flex-1 */}
        <div className="flex-1 min-h-0">
          <div className="h-full overflow-y-auto">
            {Object.values(allUsers).map((user) => {
              const isSelected = !!selectedUsers[user.uuid];
              const isMyUser = user.uuid === myUser?.uuid;

              return (
                <div
                  key={user.uuid}
                  className="flex items-center p-3 border-b border-border hover:bg-accent cursor-pointer"
                  onClick={() => handleUserToggle(user)}
                >
                  <div className="flex items-center justify-center w-5 h-5 border border-gray-300 rounded mr-3">
                    {isSelected && <Check className="h-3 w-3 text-blue-600" />}
                  </div>
                  <div className="flex items-center flex-1">
                    {user.image && (
                      <Img
                        src={user.image}
                        alt={user.name || "User"}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full mr-3"
                        useImgTag
                      />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {user.name || "Unknown User"}
                        {isMyUser && (
                          <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            You
                          </span>
                        )}
                      </div>
                      {user.email && (
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {Object.keys(allUsers).length === 0 &&
              searchValue.length >= 3 &&
              !isSearching && (
                <div className="text-center py-4 text-gray-500">
                  No users found
                </div>
              )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          {selectedUsers ? (
            <Button
              className="w-full"
              onClick={handleConfirm}
              colorScheme={"primary"}
              variant={"primary"}
            >
              {"Done"}
            </Button>
          ) : (
            <></>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
