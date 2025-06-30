import { FreeOutpostEnterTypes } from "app/components/outpost/types";
import { OutpostModel, User } from "app/services/api/types";

// Utility functions for outpost permissions
export const canInvite = ({
  outpost,
  currentUserId,
}: {
  outpost: any;
  currentUserId: string;
}): boolean => {
  const iAmCreator = currentUserId === outpost.creator_user_uuid;
  const isGroupPublic = outpost.enter_type === "public";
  const amIAMember = outpost.i_am_member;

  return iAmCreator || isGroupPublic || amIAMember;
};

export const canInviteToSpeak = ({
  outpost,
  currentUserId,
}: {
  outpost: any;
  currentUserId: string;
}): boolean => {
  const iAmCreator = currentUserId === outpost.creator_user_uuid;
  const isGroupPublic = outpost.speak_type === "everyone";

  return iAmCreator || isGroupPublic;
};

export const canShareOutpostUrl = ({
  outpost,
  myUser,
}: {
  outpost: OutpostModel;
  myUser: User;
}) => {
  if (myUser == null) {
    return false;
  }

  const iAmCreator = outpost.creator_user_uuid == myUser.uuid;
  if (iAmCreator) {
    return true;
  }
  if (outpost.enter_type == FreeOutpostEnterTypes.public) {
    return true;
  }
  if (outpost.enter_type == FreeOutpostEnterTypes.onlyLink) {
    if (outpost.i_am_member) {
      return true;
    }
  }
  return false;
};
