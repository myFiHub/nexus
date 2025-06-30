interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
}

export const StatCard = ({ title, value, subtitle }: StatCardProps) => (
  <div className="bg-card p-4 rounded-lg">
    <div className="text-sm text-muted-foreground">{title}</div>
    <div className="text-xl font-semibold text-foreground">{value}</div>
    {subtitle && (
      <div className="text-xs text-muted-foreground">{subtitle}</div>
    )}
  </div>
);
