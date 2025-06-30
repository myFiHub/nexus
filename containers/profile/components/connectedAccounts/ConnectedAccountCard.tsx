import { CopyButton } from "app/components/copyButton";
import { Img } from "app/components/Img";
import { GlobalSelectors } from "app/containers/global/selectors";
import { truncate } from "app/lib/utils";
import { ConnectedAccount } from "app/services/api/types";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { myProfileSelectors } from "../../selectors";
import { profileActions } from "../../slice";
import { accountCardActionSelectDialog } from "../SecuritySection/dialogs/accountCardActionSelectDialog";
import { PrimaryBadge } from "./PrimaryBadge";

interface ConnectedAccountCardProps {
  account: ConnectedAccount;
}

export const ConnectedAccountCard = ({
  account,
}: ConnectedAccountCardProps) => {
  const dispatch = useDispatch();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const addressOfAccountThatIsBeingMadePrimary = useSelector(
    myProfileSelectors.addressOfAccountThatIsBeingMadePrimary
  );
  const isAccountPrimary = useSelector(
    myProfileSelectors.isAccountPrimary(account.address)
  );
  const handleClick = async () => {
    if (isAccountPrimary) {
      return;
    }
    const confirmed = await accountCardActionSelectDialog();
    if (confirmed) {
      dispatch(profileActions.makeAccountPrimary(account.address));
    }
  };

  const isBeingMadePrimary =
    addressOfAccountThatIsBeingMadePrimary === account.address;
  const isThisMyCurrentAccount = myUser?.address === account.address;
  return (
    <motion.div
      className={`bg-card p-4 rounded-lg shadow-md border border-border/50 ${
        !isAccountPrimary ? "cursor-pointer" : ""
      } transition-all duration-300 ${
        isBeingMadePrimary
          ? "ring-2 ring-yellow-500/40 shadow-lg bg-gradient-to-br from-yellow-50/60 via-amber-50/40 to-orange-50/60 border-yellow-400/30"
          : "hover:shadow-lg"
      }`}
      onClick={handleClick}
      whileHover={
        !isAccountPrimary && !isBeingMadePrimary ? { scale: 1.01 } : {}
      }
      animate={
        isBeingMadePrimary
          ? {
              scale: [1, 1.02, 1],
              boxShadow: [
                "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                "0 10px 15px -3px rgba(234, 179, 8, 0.25)",
                "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              ],
            }
          : {}
      }
      transition={
        isBeingMadePrimary
          ? {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : { duration: 0.2 }
      }
    >
      <div className="flex items-center space-x-3">
        {account.image && (
          <motion.div
            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
            animate={
              isBeingMadePrimary
                ? {
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0],
                  }
                : {}
            }
            transition={
              isBeingMadePrimary
                ? {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : {}
            }
          >
            <Img
              src={account.image}
              alt={account.login_type_identifier || "account"}
              className="w-full h-full object-cover"
              useImgTag
            />
          </motion.div>
        )}
        <div className="min-w-0 flex-1">
          <div className="font-medium text-foreground truncate flex items-center gap-2">
            ID: {truncate(account.login_type_identifier)}
            <CopyButton text={account.login_type_identifier} />
            {isThisMyCurrentAccount && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Current
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground truncate">
            {account.login_type}
          </div>
          {account.is_primary && <PrimaryBadge />}
        </div>
        {isBeingMadePrimary && (
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
