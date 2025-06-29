import { Img } from "app/components/Img";
import { ConnectedAccount } from "app/services/api/types";
import { accountCardActionSelectDialog } from "../../dialogs/accountCardActionSelectDialog";
import { PrimaryBadge } from "./PrimaryBadge";

interface ConnectedAccountCardProps {
  account: ConnectedAccount;
}

export const ConnectedAccountCard = ({
  account,
}: ConnectedAccountCardProps) => {
  const handleClick = async () => {
    const confirmed = await accountCardActionSelectDialog();
    if (confirmed) {
      console.log("confirmed");
    }
  };

  return (
    <div
      className="bg-card p-4 rounded-lg shadow-md border border-border/50 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        {account.image && (
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Img
              src={account.image}
              alt={account.login_type_identifier || "account"}
              className="w-full h-full object-cover"
              useImgTag
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
          {account.is_primary && <PrimaryBadge />}
        </div>
      </div>
    </div>
  );
};
