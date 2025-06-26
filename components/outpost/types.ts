export const BuyableTicketTypes = {
  onlyFriendTechTicketHolders: "friend_tech_key_holders",
  onlyArenaTicketHolders: "arena_ticket_holders",
  onlyPodiumPassHolders: "podium_pass_holders",
} as const;

export const FreeOutpostAccessTypes = {
  public: "everyone",
  onlyLink: "having_link",
  invited_users: "invited_users",
} as const;

export const FreeOutpostSpeakerTypes = {
  everyone: FreeOutpostAccessTypes.public,
  invited_users: FreeOutpostAccessTypes.invited_users,
} as const;

export const allowedToEnterOptions = [
  { value: FreeOutpostAccessTypes.public, text: "Everyone" },
  { value: FreeOutpostAccessTypes.onlyLink, text: "Users Having the Link" },
  { value: FreeOutpostAccessTypes.invited_users, text: "Only Invited Users" },
  {
    value: BuyableTicketTypes.onlyPodiumPassHolders,
    text: "Podium Pass Holders",
  },
];

export const allowedToSpeakOptions = [
  { value: FreeOutpostSpeakerTypes.everyone, text: "Everyone" },
  { value: FreeOutpostSpeakerTypes.invited_users, text: "Only Invited Users" },
  {
    value: BuyableTicketTypes.onlyPodiumPassHolders,
    text: "Podium Pass Holders",
  },
];

export const serverAccessTypeToText = (accessType: string) => {
  if (accessType === FreeOutpostAccessTypes.public) {
    return "Everyone";
  } else if (accessType === FreeOutpostAccessTypes.onlyLink) {
    return "Users Having the Link";
  } else if (accessType === FreeOutpostAccessTypes.invited_users) {
    return "Only Invited Users";
  } else if (accessType === BuyableTicketTypes.onlyPodiumPassHolders) {
    return "Podium Pass Holders";
  }
};
export const serverSpeakerTypeToText = (accessType: string) => {
  if (accessType === FreeOutpostSpeakerTypes.everyone) {
    return "Everyone";
  } else if (accessType === FreeOutpostSpeakerTypes.invited_users) {
    return "Only Invited Users";
  } else if (accessType === BuyableTicketTypes.onlyPodiumPassHolders) {
    return "Podium Pass Holders";
  }
};