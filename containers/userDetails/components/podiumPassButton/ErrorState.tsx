interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="flex items-center gap-2 text-red-200">
      <div>⚠️</div>
      <span className="text-sm font-medium">{error}</span>
    </div>
  );
};
