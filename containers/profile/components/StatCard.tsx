import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: ReactNode;
  action?: ReactNode;
}

export const StatCard = ({ title, value, subtitle, action }: StatCardProps) => (
  <div className="bg-card p-4 rounded-lg relative">
    <div className="text-sm text-muted-foreground">{title}</div>
    <div className="text-xl font-semibold text-foreground">{value}</div>
    {subtitle && (
      <div className="text-xs text-muted-foreground">{subtitle}</div>
    )}
    {action && (
      <div className="text-xs text-muted-foreground absolute top-2 right-2">
        {action}
      </div>
    )}
  </div>
);
