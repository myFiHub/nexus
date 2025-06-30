import { CheerAndBoo } from "../cheerAndBoo";
import { LikeAndDislike } from "../likeAndDislike";

interface MemberActionsProps {
  address: string;
}

export const MemberActions = ({ address }: MemberActionsProps) => {
  return (
    <div className="flex gap-1">
      <LikeAndDislike like address={address} />
      <LikeAndDislike like={false} address={address} />

      <CheerAndBoo cheer address={address} />
      <CheerAndBoo cheer={false} address={address} />
    </div>
  );
};
