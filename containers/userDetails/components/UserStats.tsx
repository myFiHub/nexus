import { IconTile, Tone } from "app/components/aurora";
import { compactNumber } from "app/lib/format";
import { User } from "app/services/api/types";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { ReactNode } from "react";

interface UserStatsProps {
  user: User;
}

const Stat = ({
  icon,
  tone,
  label,
  value,
}: {
  icon: ReactNode;
  tone: Tone;
  label: string;
  value: number;
}) => (
  <div className="glass-card flex items-center gap-3 p-4">
    <IconTile tone={tone}>{icon}</IconTile>
    <div className="min-w-0">
      <p className="truncate text-xs text-text-muted">{label}</p>
      <p className="text-xl font-bold text-foreground tabular-nums">{compactNumber(value)}</p>
    </div>
  </div>
);

export const UserStats = ({ user }: UserStatsProps) => (
  <div className="animate-entrance mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
    <Stat
      icon={<ThumbsUp className="h-4 w-4" />}
      tone="success"
      label="Cheers received"
      value={user.received_cheer_count ?? 0}
    />
    <Stat
      icon={<ThumbsDown className="h-4 w-4" />}
      tone="danger"
      label="Boos received"
      value={user.received_boo_count ?? 0}
    />
    <Stat
      icon={<ThumbsUp className="h-4 w-4" />}
      tone="accent"
      label="Cheers sent"
      value={user.sent_cheer_count ?? 0}
    />
    <Stat
      icon={<ThumbsDown className="h-4 w-4" />}
      tone="violet"
      label="Boos sent"
      value={user.sent_boo_count ?? 0}
    />
  </div>
);
