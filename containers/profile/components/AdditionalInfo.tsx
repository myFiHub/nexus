import { isExternalWalletLoginMethod } from "app/components/Dialog/loginMethodSelectDialog";
import { User } from "app/services/api/types";
import { Wallet } from "lucide-react";
import { InfoCard } from "./InfoCard";

interface AdditionalInfoProps {
  user: User;
}

export const AdditionalInfo = ({ user }: AdditionalInfoProps) => {
  const myLoginType = user.login_type;
  const isExternalWallet = isExternalWalletLoginMethod(myLoginType ?? "");
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
        <Wallet className="w-5 h-5 text-primary" />
        Wallet Info
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard
          title="Wallet Information"
          items={[
            ...(user.aptos_address
              ? [
                  {
                    label: "Movement Address",
                    value: user.aptos_address,
                    isMonospace: true,
                  },
                  ...(!isExternalWallet
                    ? [
                        {
                          label: "EVM Address",
                          value: user.address,
                          isMonospace: true,
                        },
                      ]
                    : []),
                ]
              : []),
            ...(user.external_wallet_address
              ? [
                  {
                    label: "External Wallet",
                    value: user.external_wallet_address,
                    isMonospace: true,
                  },
                ]
              : []),
          ]}
        />
        <InfoCard
          title="Account Information"
          items={[
            { label: "UUID", value: user.uuid, isMonospace: true },
            ...(user.login_type
              ? [{ label: "Login Type", value: user.login_type }]
              : []),
            ...(user.is_over_18 !== undefined
              ? [{ label: "Age Verification", value: user.is_over_18 }]
              : []),
          ]}
        />
      </div>
    </div>
  );
};
