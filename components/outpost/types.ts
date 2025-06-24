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
