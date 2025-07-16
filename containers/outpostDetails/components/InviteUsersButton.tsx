"use client";

import { Button, ButtonProps } from "app/components/Button";
import { userSelectToInviteDialog } from "app/components/Dialog/userSelectToInvite";
import { canInvite } from "app/lib/outpostPermissions";
import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import { InviteRequestModel, OutpostModel } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { GlobalSelectors } from "../../global/selectors";

interface InviteUsersButtonProps {
  outpost: OutpostModel;
  className?: string;
  withWrapper?: boolean;
  buttonSize?: ButtonProps["size"];
}

const Content = ({
  outpost,
  className,
  withWrapper,
  buttonSize,
}: InviteUsersButtonProps) => {
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [outpostToUse, setOutpostToUse] = useState<OutpostModel>(outpost);

  if (!myUser) {
    return null;
  }

  const canInviteUsers = canInvite({
    outpost,
    currentUserId: myUser.uuid,
  });

  if (!canInviteUsers) {
    return null;
  }

  const handleInviteUsers = async () => {
    try {
      const alreadyInvitedUsers = outpostToUse.invites;
      const result = await userSelectToInviteDialog({
        title: "Invite Users",
        outpostInvites: alreadyInvitedUsers,
        creatorUuid: outpostToUse.creator_user_uuid,
        outpost: outpostToUse,
      });

      if (result.confirmed && result.invitedUsers.length > 0) {
        // Invite each selected user
        const invitePromises = result.invitedUsers.map((user) => {
          const invite: InviteRequestModel = {
            outpost_uuid: outpostToUse.uuid,
            invitee_user_uuid: user.user.uuid,
            can_speak: user.invitedToSpeak,
          };
          console.log("invite", invite);
          return podiumApi.inviteUserToJoinOutpost(invite);
        });

        setIsLoading(true);
        const results = await Promise.all(invitePromises);
        const successCount = results.filter(Boolean).length;
        const totalCount = results.length;

        if (successCount === totalCount) {
          toast.success(
            `Successfully invited ${successCount} user${
              successCount !== 1 ? "s" : ""
            } to the outpost`
          );
          const newOutpost = await podiumApi.getOutpost(outpostToUse.uuid);
          console.log("newOutpost", newOutpost);
          if (newOutpost) {
            setOutpostToUse(newOutpost);
          }
        } else if (successCount > 0) {
          toast.warning(
            `Invited ${successCount} out of ${totalCount} users successfully`
          );
        } else {
          toast.error("Failed to invite users. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error inviting users:", error);
      toast.error("Failed to invite users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const component = (
    <Button
      onClick={handleInviteUsers}
      className={className}
      variant="outline"
      disabled={isLoading}
      size={buttonSize}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <UserPlus className="w-4 h-4 mr-2" />
      )}
      Invite Users
    </Button>
  );
  if (withWrapper) {
    return <div className="bg-card p-6 rounded-xl shadow-sm">{component}</div>;
  }
  return component;
};

export function InviteUsersButton({
  outpost,
  className,
  withWrapper = true,
  buttonSize = "md",
}: InviteUsersButtonProps) {
  return (
    <ReduxProvider>
      <Content
        outpost={outpost}
        className={className}
        withWrapper={withWrapper}
        buttonSize={buttonSize}
      />
    </ReduxProvider>
  );
}
