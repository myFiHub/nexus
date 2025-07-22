"use client";
import UserLink from "app/components/AppLink/userLink";
import { Button } from "app/components/Button";
import { CopyButton } from "app/components/copyButton";
import { Img } from "app/components/Img";
import { Loader } from "app/components/Loader";
import { logoUrl } from "app/lib/constants";
import { AppPages } from "app/lib/routes";
import { truncate } from "app/lib/utils";
import { BlockchainPassData } from "app/services/move/types";
import { ExternalLink, Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { AssetsSelectors } from "../../../_assets/selectore";
import { ProfileSectionTitle } from "../ProfileSectionTitle";
import { EmptyState } from "./EmptyState";

const SectionWrapper = ({ children }: { children: React.ReactNode }) => (
  <div>
    <ProfileSectionTitle>My Passes</ProfileSectionTitle>
    {children}
  </div>
);

const PassCard = ({ pass }: { pass: BlockchainPassData }) => {
  const name = pass.userName || "External User";
  return (
    <div
      key={pass.passSymbol}
      className="bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden "
    >
      {/* Header with image and name */}
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-500 ">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-3">
            <UserLink
              id={AppPages.userDetails(pass.userUuid ?? "")}
              ignore={!pass.userName}
              underline={false}
              className="p-0 flex items-center gap-4"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                <Img
                  src={pass.userImage || logoUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  useImgTag
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">{name}</h3>
                <p className="text-sm text-white/80">
                  {pass.amountOwned}{" "}
                  {pass.amountOwned === 1 ? "pass" : "passes"}
                </p>
              </div>
            </UserLink>
          </div>
        </div>
        {/* Pass symbol at bottom right */}
        <div className="absolute bottom-2 right-2">
          <span
            className="text-white text-[12px] font-bold font-mono bg-black/30 px-3 py-1 rounded-lg shadow-md backdrop-blur-sm drop-shadow-md max-w-[80%] truncate whitespace-nowrap tracking-wide"
            title={pass.passSymbol}
          >
            {pass.passSymbol}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Follow status */}
          <div className="flex items-center gap-2 text-sm">
            {pass.followedByMe ? (
              <Heart
                className={`w-4 h-4 ${
                  pass.followedByMe
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400"
                }`}
              />
            ) : (
              <div />
            )}
            <span
              className={pass.followedByMe ? "text-red-500" : "text-gray-500"}
            >
              {pass.followedByMe ? "Following" : "Not following"}
            </span>
          </div>

          {/* Address info */}
          <div className="text-sm">
            {pass.userName ? (
              <>
                <p className="text-gray-500 mb-1">
                  {pass.userName?.split(" ")[0]}'s Address
                </p>
                <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded break-all flex items-center gap-2">
                  {truncate(pass.userAptosAddress ?? "", 20)}
                  <CopyButton text={pass.userAptosAddress ?? ""} />
                </p>
              </>
            ) : (
              <p className="text-gray-500 mb-1 h-16">External User</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {pass.userAptosAddress ? (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() =>
                  window.open(
                    `https://explorer.movementnetwork.xyz/account/${pass.userAptosAddress}?network=mainnet`,
                    "_blank"
                  )
                }
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Explorer
              </Button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MyPasses = () => {
  const passes = useSelector(AssetsSelectors.myBlockchainPassesPasses);
  const loading = useSelector(AssetsSelectors.myBlockchainPassesLoading);
  const error = useSelector(AssetsSelectors.myBlockchainPassesError);

  if (loading) {
    return (
      <SectionWrapper>
        <div className="flex items-center justify-center p-4">
          <Loader className="w-6 h-6 animate-spin" />
        </div>
      </SectionWrapper>
    );
  }

  if (error) {
    return (
      <SectionWrapper>
        <div className="text-red-500 p-4 text-center">{error}</div>
      </SectionWrapper>
    );
  }

  if (!passes || passes.length === 0) {
    return (
      <SectionWrapper>
        <EmptyState />
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {passes.map((pass) => (
          <PassCard key={pass.passSymbol} pass={pass} />
        ))}
      </div>
    </SectionWrapper>
  );
};
