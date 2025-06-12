interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
}

export const StatCard = ({ title, value, subtitle }: StatCardProps) => (
  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
    <div className="text-sm text-gray-500 dark:text-gray-400">{title}</div>
    <div className="text-xl font-semibold text-gray-900 dark:text-white">
      {value}
    </div>
    {subtitle && (
      <div className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</div>
    )}
  </div>
);
