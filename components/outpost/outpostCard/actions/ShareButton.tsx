"use client";
import { GlobalSelectors } from "app/containers/global/selectors";
import { canShareOutpostUrl } from "app/lib/outpostPermissions";
import { generateOutpostShareUrl } from "app/lib/utils";
import { OutpostModel } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../Tooltip";

interface ShareButtonProps {
  outpost: OutpostModel;
  className?: string;
}

const Content = ({ outpost, className }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const outpostId = outpost.uuid;

  const handleShare = async () => {
    try {
      const shareUrl = generateOutpostShareUrl(outpostId);
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy share link:", err);
    }
  };

  const shouldShowTooltip = copied || isHovered;
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  if (!myUser) {
    return null;
  }
  const canShare = canShareOutpostUrl({ outpost, myUser });
  if (!canShare) {
    return null;
  }

  return (
    <Tooltip open={shouldShowTooltip}>
      <TooltipTrigger asChild>
        <Button
          onClick={handleShare}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          variant="outline"
          size="sm"
          className={`bg-black/60 backdrop-blur-sm border-white/20 text-white hover:bg-black/80 hover:border-white/40 ${className}`}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="text-white">
        {copied ? "Copied!" : "Share outpost"}
      </TooltipContent>
    </Tooltip>
  );
};

export const ShareButton = ({ outpost, className }: ShareButtonProps) => {
  return (
    <ReduxProvider>
      <Content outpost={outpost} className={className} />
    </ReduxProvider>
  );
};
