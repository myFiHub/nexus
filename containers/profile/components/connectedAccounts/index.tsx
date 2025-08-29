import { Button } from "app/components/Button";
import { confirmAddOrSwitchAccountDialog } from "app/components/Dialog/confirmAddOrSwitchAccountDialog";
import { isExternalWalletLoginMethod } from "app/components/Dialog/loginMethodSelect";
import { Loader } from "app/components/Loader";
import { GlobalSelectors } from "app/containers/global/selectors";
import { globalActions } from "app/containers/global/slice";
import { ConnectedAccount } from "app/services/api/types";
import { Plus, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { ConnectedAccountCard } from "./ConnectedAccountCard";

interface ConnectedAccountsProps {
  accounts: ConnectedAccount[];
}

export const ConnectedAccounts = ({ accounts }: ConnectedAccountsProps) => {
  const dispatch = useDispatch();
  const logingIn = useSelector(GlobalSelectors.logingIn);
  const podiumUserInfo = useSelector(GlobalSelectors.podiumUserInfo);
  const isExternalWallet = isExternalWalletLoginMethod(
    podiumUserInfo?.login_type ?? ""
  );
  const switchingAccount = useSelector(GlobalSelectors.switchingAccount);

  const handleAddAccount = async () => {
    const result = await confirmAddOrSwitchAccountDialog();
    if (result.confirmed) {
      dispatch(globalActions.switchAccount());
    }
  };

  if (!accounts?.length) return null;
  const disabled = logingIn || isExternalWallet;
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Connected Accounts
        </h2>
        <Button
          onClick={handleAddAccount}
          disabled={disabled}
          size="sm"
          variant="outline"
          className="flex items-center gap-2"
        >
          {switchingAccount ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : isExternalWallet ? (
            <></>
          ) : (
            <Plus className="w-4 h-4 animate-pulse" />
          )}
          {!isExternalWallet ? "Add Account" : "External Wallet"}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <ConnectedAccountCard key={account.uuid} account={account} />
        ))}
      </div>
    </div>
  );
};
