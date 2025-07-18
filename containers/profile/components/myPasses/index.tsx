import { AppLink } from "app/components/AppLink";
import { Button } from "app/components/Button";
import { CopyButton } from "app/components/copyButton";
import { Img } from "app/components/Img";
import { Loader } from "app/components/Loader";
import { AppPages } from "app/lib/routes";
import { truncate } from "app/lib/utils";
import { ExternalLink, Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { AssetsSelectors } from "../../../_assets/selectore";

const SectionWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-8">
    <h2 className="text-xl font-semibold mb-4">My Passes</h2>
    {children}
  </div>
);

const PassCard = ({ pass }: { pass: any }) => {
  return (
    <div
      key={pass.uuid}
      className="bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden "
    >
      {/* Header with image and name */}
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white">
              <Img
                src={pass.image || "/default-avatar.png"}
                alt={pass.name}
                fill
                className="object-cover"
                useImgTag
              />
            </div>
            <div className="flex-1 min-w-0">
              <AppLink
                href={AppPages.userDetails(pass.podium_pass_owner_address)}
                className="p-0"
              >
                <h3 className="font-medium text-white truncate">{pass.name}</h3>
              </AppLink>
              <p className="text-sm text-white/80">
                {pass.count} {pass.count === 1 ? "pass" : "passes"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Follow status */}
          <div className="flex items-center gap-2 text-sm">
            <Heart
              className={`w-4 h-4 ${
                pass.followed_by_me
                  ? "text-red-500 fill-red-500"
                  : "text-gray-400"
              }`}
            />
            <span
              className={pass.followed_by_me ? "text-red-500" : "text-gray-500"}
            >
              {pass.followed_by_me ? "Following" : "Not following"}
            </span>
          </div>

          {/* Address info */}
          <div className="text-sm">
            <p className="text-gray-500 mb-1">
              {pass.name.split(" ")[0]}'s Address
            </p>
            <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded break-all flex items-center gap-2">
              {truncate(pass.podium_pass_owner_address, 20)}
              <CopyButton text={pass.podium_pass_owner_address} />
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() =>
                window.open(
                  `https://explorer.movementnetwork.xyz/account/${pass.podium_pass_owner_address}?network=mainnet`,
                  "_blank"
                )
              }
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MyPasses = () => {
  const passes = useSelector(AssetsSelectors.passesListBoughtByMe);
  const loading = useSelector(AssetsSelectors.passesListBoughtByMeLoading);
  const error = useSelector(AssetsSelectors.passesListBoughtByMeError);

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
        <div className="text-gray-500 p-4 text-center">No passes found</div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {passes.map((pass) => (
          <PassCard key={pass.uuid} pass={pass} />
        ))}
      </div>
    </SectionWrapper>
  );
};
