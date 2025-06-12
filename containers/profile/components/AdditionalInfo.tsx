import { User } from "app/services/api/types";
import { InfoCard } from "./InfoCard";

interface AdditionalInfoProps {
  user: User;
}

export const AdditionalInfo = ({ user }: AdditionalInfoProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <InfoCard
      title="Wallet Information"
      items={[
        { label: "EVM Address", value: user.address, isMonospace: true },
        ...(user.aptos_address
          ? [
              {
                label: "Movement Address",
                value: user.aptos_address,
                isMonospace: true,
              },
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
);
