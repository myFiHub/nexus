import { ConnectedAccount } from "app/services/api/types";
import { ConnectedAccountCard } from "./ConnectedAccountCard";

interface ConnectedAccountsProps {
  accounts: ConnectedAccount[];
}

export const ConnectedAccounts = ({ accounts }: ConnectedAccountsProps) => {
  if (!accounts?.length) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Connected Accounts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <ConnectedAccountCard key={account.uuid} account={account} />
        ))}
      </div>
    </div>
  );
};
