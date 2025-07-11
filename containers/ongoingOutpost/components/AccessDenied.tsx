import { Button } from "app/components/Button";
import { JoinButton } from "app/containers/outpostDetails/components/JoinButton";
import { AppPages } from "app/lib/routes";
import { OutpostModel } from "app/services/api/types";
import { AlertCircle, Lock, Shield, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

interface AccessDeniedProps {
  outpost: OutpostModel;
}

export const AccessDenied = ({ outpost }: AccessDeniedProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const goBack = () => {
    router.push(AppPages.outpostDetails(outpost.uuid));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-card border border-border rounded-xl">
      <div className="text-center space-y-6 max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-10 h-10 text-destructive" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground">
            Access Restricted
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            You don't have permission to enter this outpost. This may be
            because:
          </p>

          <div className="text-left space-y-2 text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500" />
              <span>The outpost requires special access permissions</span>
            </div>
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 mt-0.5 text-blue-500" />
              <span>You may need to be invited by the creator</span>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 mt-0.5 text-green-500" />
              <span>Certain membership requirements need to be met</span>
            </div>
            <div className="flex items-start gap-2">
              <X className="w-4 h-4 mt-0.5 text-red-500" />
              <span>There was an error joining the outpost</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          <Button onClick={goBack} className="w-full gap-2" variant="primary">
            View Outpost Details
          </Button>

          <Button
            onClick={() => router.push(AppPages.allOutposts)}
            className="w-full"
            variant="outline"
          >
            Browse Other Outposts
          </Button>
          <JoinButton
            outpost={outpost}
            joinComponent={<div>Request to Join this outpost</div>}
          />
        </div>
      </div>
    </div>
  );
};
