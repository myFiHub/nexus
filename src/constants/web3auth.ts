export const WEB3AUTH_PROVIDERS = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  DISCORD: 'discord',
  GITHUB: 'github',
  EMAIL: 'email',
} as const;

export type Web3AuthProvider = typeof WEB3AUTH_PROVIDERS[keyof typeof WEB3AUTH_PROVIDERS]; 