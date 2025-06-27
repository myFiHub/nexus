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
