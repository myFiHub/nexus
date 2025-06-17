import { Img } from "app/components/Img";
import { ConnectedAccount } from "app/services/api/types";

interface ConnectedAccountCardProps {
  account: ConnectedAccount;
}

export const ConnectedAccountCard = ({
  account,
}: ConnectedAccountCardProps) => (
  <div className="bg-card p-4 rounded-lg shadow-md border border-border/50">
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
        <div className="font-medium text-foreground truncate">
          ID: {account.login_type_identifier}
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {account.login_type}
        </div>
        {account.is_primary && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            Primary
          </span>
        )}
      </div>
    </div>
  </div>
);
