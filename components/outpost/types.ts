export const BuyableTicketTypes = {
  onlyPodiumPassHolders: "podium_pass_holders",
} as const;

export const FreeOutpostEnterTypes = {
  public: "everyone",
  onlyLink: "having_link",
  invited_users: "invited_users",
} as const;

export const FreeOutpostSpeakerTypes = {
  everyone: FreeOutpostEnterTypes.public,
  invited_users: FreeOutpostEnterTypes.invited_users,
} as const;

export const allowedToEnterOptions = [
  { value: FreeOutpostEnterTypes.public, text: "Everyone" },
  { value: FreeOutpostEnterTypes.onlyLink, text: "Users Having the Link" },
  { value: FreeOutpostEnterTypes.invited_users, text: "Only Invited Users" },
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

export const serverEnterTypeToText = (accessType: string) => {
  if (accessType === FreeOutpostEnterTypes.public) {
    return "Everyone";
  } else if (accessType === FreeOutpostEnterTypes.onlyLink) {
    return "Users Having the Link";
  } else if (accessType === FreeOutpostEnterTypes.invited_users) {
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
