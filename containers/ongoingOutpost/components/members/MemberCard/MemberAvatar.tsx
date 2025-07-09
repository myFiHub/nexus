import { LiveMember } from "app/services/api/types";
import { Img } from "../../../../../components/Img";
import { logoUrl } from "../../../../../lib/constants";

interface MemberAvatarProps {
  member: LiveMember;
}

export const MemberAvatar = ({ member }: MemberAvatarProps) => {
  return (
    <div className="relative">
      <Img
        src={member.image || logoUrl}
        alt={member.name}
        className="w-12 h-12 rounded-full border-2 border-primary/20"
        useImgTag
      />
    </div>
  );
};
