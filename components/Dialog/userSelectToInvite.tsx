"use client";

// Usage example:
//
// import { userSelectToInviteDialog } from "app/components/Dialog/userSelectToInvite";
//
// const handleInviteUsers = async () => {
//   const result = await userSelectToInviteDialog({
//     title: "Invite Users",
//     content: "Choose users to invite:",
//     outpostInvites: outpost.invites, // Optional: Array of existing invites
//     confirmOpts: { text: "Send Invites" },
//     cancelOpts: { text: "Cancel" }
//   });
//
//   if (result.confirmed) {
//     console.log("Invited users:", result.invitedUsers);
//     // result.invitedUsers is an array of {user: User, invited: boolean, invitedToSpeak: boolean}
//   }
// };

import { Img } from "app/components/Img";
import { Loader } from "app/components/Loader";
import { GlobalSelectors } from "app/containers/global/selectors";
import { canInviteToSpeak } from "app/lib/outpostPermissions";
import { truncate } from "app/lib/utils";
import podiumApi from "app/services/api";
import { InviteModel, OutpostModel, User } from "app/services/api/types";
import { Search, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../Button";
import { Input } from "../Input";
import { CopyButton } from "../copyButton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./index";

interface InvitedUser {
  user: User;
  invited: boolean;
  invitedToSpeak: boolean;
}

interface UserSelectToInviteDialogProps {
  title: ReactNode;
  outpostInvites?: InviteModel[];
  creatorUuid?: string;
  outpost?: OutpostModel;
}

export type UserSelectToInviteDialogResult = {
  confirmed: boolean;
  invitedUsers: InvitedUser[];
};

let resolvePromise: ((value: UserSelectToInviteDialogResult) => void) | null =
  null;

export const userSelectToInviteDialog = ({
  title,
  outpostInvites = [],
  creatorUuid,
  outpost,
}: UserSelectToInviteDialogProps): Promise<UserSelectToInviteDialogResult> => {
  return new Promise((resolve) => {
    resolvePromise = resolve;
    const event = new CustomEvent("show-user-select-to-invite-dialog", {
      detail: {
        title,
        outpostInvites,
        creatorUuid,
        outpost,
      },
    });
    window.dispatchEvent(event);
  });
};

export const UserSelectToInviteDialogProvider = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<Record<string, User>>({});
  const [isSearching, setIsSearching] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
  const [dialogContent, setDialogContent] =
    useState<UserSelectToInviteDialogProps | null>(null);
  const outpost = dialogContent?.outpost;
  const members = outpost?.members ?? [];
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);

  useEffect(() => {
    const handleShowDialog = (
      event: CustomEvent<UserSelectToInviteDialogProps>
    ) => {
      setDialogContent(event.detail);
      setInvitedUsers([]);
      setIsOpen(true);
    };

    window.addEventListener(
      "show-user-select-to-invite-dialog",
      handleShowDialog as EventListener
    );
    return () => {
      window.removeEventListener(
        "show-user-select-to-invite-dialog",
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
        // Filter out my user and creator user only
        const creatorUuid = dialogContent?.creatorUuid;

        const filteredResults = Object.fromEntries(
          Object.entries(results).filter(
            ([uuid]) => uuid !== myUser?.uuid && uuid !== creatorUuid
          )
        );
        setSearchResults(filteredResults);
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults({});
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [searchValue, myUser?.uuid, dialogContent?.creatorUuid]);

  const handleInviteOption = (
    user: User,
    option: "invite" | "inviteToSpeak"
  ) => {
    setInvitedUsers((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.user.uuid === user.uuid
      );

      if (existingIndex >= 0) {
        // Update existing user
        const updated = [...prev];
        if (option === "invite") {
          const newInvited = !updated[existingIndex].invited;
          const newInvitedToSpeak = updated[existingIndex].invitedToSpeak;

          // If both options are false, remove the user from the list
          if (!newInvited && !newInvitedToSpeak) {
            return updated.filter((_, index) => index !== existingIndex);
          }

          updated[existingIndex] = {
            user,
            invited: newInvited,
            invitedToSpeak: newInvitedToSpeak,
          };
        } else {
          const newInvited = updated[existingIndex].invited;
          const newInvitedToSpeak = !updated[existingIndex].invitedToSpeak;

          // If both options are false, remove the user from the list
          if (!newInvited && !newInvitedToSpeak) {
            return updated.filter((_, index) => index !== existingIndex);
          }

          updated[existingIndex] = {
            user,
            invited: newInvited,
            invitedToSpeak: newInvitedToSpeak,
          };
        }
        return updated;
      } else {
        // Add new user
        const newInvitedUser: InvitedUser = {
          user,
          invited: option === "invite",
          invitedToSpeak: option === "inviteToSpeak",
        };
        return [...prev, newInvitedUser];
      }
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);

    // Filter out users whose invitation status hasn't changed
    const changedInvitedUsers = invitedUsers.filter((invitedUser) => {
      const existingInvite = dialogContent?.outpostInvites?.find(
        (invite) => invite.invitee_uuid === invitedUser.user.uuid
      );

      if (!existingInvite) {
        // New user being invited - include them
        return true;
      }

      // Check if the invitation type has changed
      const wasInvitedToSpeak = existingInvite.can_speak;
      const wasInvitedToListen = !existingInvite.can_speak;

      const isNowInvitedToSpeak = invitedUser.invitedToSpeak;
      const isNowInvitedToListen = invitedUser.invited;

      // Return true if the invitation type has changed
      return (
        wasInvitedToSpeak !== isNowInvitedToSpeak ||
        wasInvitedToListen !== isNowInvitedToListen
      );
    });

    resolvePromise?.({ confirmed: true, invitedUsers: changedInvitedUsers });
    resolvePromise = null;
    setSearchValue("");
    setSearchResults({});
    setInvitedUsers([]);
  };

  const handleCancel = () => {
    setIsOpen(false);

    // Filter out users whose invitation status hasn't changed
    const changedInvitedUsers = invitedUsers.filter((invitedUser) => {
      const existingInvite = dialogContent?.outpostInvites?.find(
        (invite) => invite.invitee_uuid === invitedUser.user.uuid
      );

      if (!existingInvite) {
        // New user being invited - include them
        return true;
      }

      // Check if the invitation type has changed
      const wasInvitedToSpeak = existingInvite.can_speak;
      const wasInvitedToListen = !existingInvite.can_speak;

      const isNowInvitedToSpeak = invitedUser.invitedToSpeak;
      const isNowInvitedToListen = invitedUser.invited;

      // Return true if the invitation type has changed
      return (
        wasInvitedToSpeak !== isNowInvitedToSpeak ||
        wasInvitedToListen !== isNowInvitedToListen
      );
    });

    resolvePromise?.({ confirmed: false, invitedUsers: changedInvitedUsers });
    resolvePromise = null;
    setSearchValue("");
    setSearchResults({});
    setInvitedUsers([]);
  };

  const clearSearch = () => {
    setSearchValue("");
    setSearchResults({});
  };

  const allUsers = {
    ...searchResults,
  };

  const getInvitedUser = (user: User): InvitedUser | undefined => {
    return invitedUsers.find((item) => item.user.uuid === user.uuid);
  };

  // Get existing invite for a user
  const getExistingInvite = (user: User): InviteModel | undefined => {
    return dialogContent?.outpostInvites?.find(
      (invite) => invite.invitee_uuid === user.uuid
    );
  };

  // Initialize invited users from existing invites when dialog opens
  useEffect(() => {
    if (isOpen && dialogContent?.outpostInvites) {
      const initialInvitedUsers: InvitedUser[] = [];

      // Add existing invites to the initial state
      dialogContent.outpostInvites.forEach((invite) => {
        // Find the user data for this invite
        const user = Object.values(searchResults).find(
          (u) => u.uuid === invite.invitee_uuid
        );
        if (user) {
          initialInvitedUsers.push({
            user,
            invited: !invite.can_speak, // If can_speak is false, they were invited to listen
            invitedToSpeak: invite.can_speak, // If can_speak is true, they were invited to speak
          });
        }
      });

      setInvitedUsers(initialInvitedUsers);
    }
  }, [isOpen, dialogContent?.outpostInvites, searchResults]);

  // Check if there are any changes in invitations
  const hasChanges = () => {
    return invitedUsers.some((invitedUser) => {
      const existingInvite = dialogContent?.outpostInvites?.find(
        (invite) => invite.invitee_uuid === invitedUser.user.uuid
      );

      if (!existingInvite) {
        // New user being invited - this is a change
        return true;
      }

      // Check if the invitation type has changed
      const wasInvitedToSpeak = existingInvite.can_speak;
      const wasInvitedToListen = !existingInvite.can_speak;

      const isNowInvitedToSpeak = invitedUser.invitedToSpeak;
      const isNowInvitedToListen = invitedUser.invited;

      // Return true if the invitation type has changed
      return (
        wasInvitedToSpeak !== isNowInvitedToSpeak ||
        wasInvitedToListen !== isNowInvitedToListen
      );
    });
  };

  // Check if current user can invite to speak
  const canInviteToSpeakForCurrentUser =
    dialogContent?.outpost && myUser
      ? canInviteToSpeak({
          outpost: dialogContent.outpost,
          currentUserId: myUser.uuid,
        })
      : false;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          // When dialog is closed (by clicking outside, pressing escape, etc.), return false
          setIsOpen(false);

          // Filter out users whose invitation status hasn't changed
          const changedInvitedUsers = invitedUsers.filter((invitedUser) => {
            const existingInvite = dialogContent?.outpostInvites?.find(
              (invite) => invite.invitee_uuid === invitedUser.user.uuid
            );

            if (!existingInvite) {
              // New user being invited - include them
              return true;
            }

            // Check if the invitation type has changed
            const wasInvitedToSpeak = existingInvite.can_speak;
            const wasInvitedToListen = !existingInvite.can_speak;

            const isNowInvitedToSpeak = invitedUser.invitedToSpeak;
            const isNowInvitedToListen = invitedUser.invited;

            // Return true if the invitation type has changed
            return (
              wasInvitedToSpeak !== isNowInvitedToSpeak ||
              wasInvitedToListen !== isNowInvitedToListen
            );
          });

          resolvePromise?.({
            confirmed: false,
            invitedUsers: changedInvitedUsers,
          });
          resolvePromise = null;
          setSearchValue("");
          setSearchResults({});
          setInvitedUsers([]);
        }
      }}
    >
      <DialogContent className="max-w-md min-h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{dialogContent?.title}</DialogTitle>
        </DialogHeader>

        {/* Search Input */}
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
                <Loader className="h-4 w-4 text-gray-400 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 min-h-0">
          <div className="h-full overflow-y-auto">
            {Object.values(allUsers).map((user: User) => {
              const invitedUser = getInvitedUser(user);
              const existingInvite = getExistingInvite(user);
              const isMember = members.some(
                (member) => member.uuid === user.uuid
              );
              return (
                <div
                  key={user.uuid}
                  className="flex items-center p-3 border-b border-border hover:bg-accent"
                >
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
                      </div>
                      {user.aptos_address && (
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <span>{truncate(user.aptos_address)}</span>
                          <CopyButton text={user.aptos_address} />
                        </div>
                      )}
                      {isMember ? (
                        <div className="text-xs text-blue-600 font-medium">
                          Already a member
                        </div>
                      ) : (
                        existingInvite && (
                          <div className="text-xs text-blue-600 font-medium">
                            Already invited{" "}
                            {existingInvite.can_speak
                              ? "to speak"
                              : "to listen"}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Invite Options */}
                  <div className="flex gap-2 ml-3">
                    <Button
                      size="sm"
                      variant={invitedUser?.invited ? "primary" : "outline"}
                      onClick={() => handleInviteOption(user, "invite")}
                      className="text-xs px-2 py-1 h-7"
                      disabled={!!existingInvite || isMember}
                    >
                      Invite Muted
                    </Button>
                    {canInviteToSpeakForCurrentUser && (
                      <Button
                        size="sm"
                        variant={
                          invitedUser?.invitedToSpeak ? "primary" : "outline"
                        }
                        onClick={() =>
                          handleInviteOption(user, "inviteToSpeak")
                        }
                        className="text-xs px-2 py-1 h-7"
                        disabled={!!existingInvite || isMember}
                      >
                        Invite to Speak
                      </Button>
                    )}
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
          <Button
            className="w-full"
            onClick={handleConfirm}
            variant={"primary"}
            disabled={!hasChanges()}
          >
            Send Invites
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
