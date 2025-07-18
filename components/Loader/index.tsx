import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface LoaderProps {
  className?: string;
  size?: number;
}

export const Loader = ({ className, size }: LoaderProps) => {
  return <Loader2 className={cn("animate-spin", className)} size={size} />;
};
