import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-10 h-10 border-4",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
}) => (
  <div
    className={[
      sizeMap[size],
      "border-muted-foreground border-t-transparent rounded-full animate-spin",
      className,
    ].join(" ")}
  />
);

export default LoadingSpinner;
