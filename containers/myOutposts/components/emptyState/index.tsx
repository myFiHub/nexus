import { ReactNode } from "react";
import { cn } from "../../../../lib/utils";
import { CreateOutpostButton } from "../createOutpostButton";
import { DiscoverButton } from "../discoverButton";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actions,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      {/* Icon */}
      {icon && (
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
          <div className="h-10 w-10 text-muted-foreground">{icon}</div>
        </div>
      )}

      {/* Title */}
      <h3 className="mb-2 text-xl font-semibold text-foreground sm:text-2xl">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mb-6 max-w-sm text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      )}

      {/* Action Button */}
      {actions && <>{actions}</>}
    </div>
  );
};

// Default empty state for outposts
export const EmptyOutposts = () => {
  return (
    <EmptyState
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-10 w-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      }
      title="No outposts yet"
      description="Create your first outpost to start connecting with others and building your community."
      actions={
        <div className="flex gap-2 ">
          <DiscoverButton />
          <CreateOutpostButton />
        </div>
      }
    />
  );
};
