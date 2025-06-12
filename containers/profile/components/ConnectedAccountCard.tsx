import { Img } from "app/components/Img";
import { ConnectedAccount } from "app/services/api/types";

interface ConnectedAccountCardProps {
  account: ConnectedAccount;
}

export const ConnectedAccountCard = ({
  account,
}: ConnectedAccountCardProps) => (
  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
    <div className="flex items-center space-x-3">
      {account.image && (
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Img
            src={account.image}
            alt={account.login_type_identifier || "account"}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="font-medium text-gray-900 dark:text-white truncate">
          ID: {account.login_type_identifier}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {account.login_type}
        </div>
        {account.is_primary && (
          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full">
            Primary
          </span>
        )}
      </div>
    </div>
  </div>
);
