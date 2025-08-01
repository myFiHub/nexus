import { GlobalSelectors } from "app/containers/global/selectors";
import { globalActions } from "app/containers/global/slice";
import { AppPages } from "app/lib/routes";
import { truncate } from "app/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Crown, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppLink } from "../AppLink";
import { LoginButton } from "../header/LoginButton";
import { Img } from "../Img";
import { Separator } from "./separator";
import { SidebarItem } from "./SidebarItem";
import { SidebarSectionProps } from "./types";

export function UserSection({ isOpen, isMobile, items }: SidebarSectionProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const loggedIn = useSelector(GlobalSelectors.isLoggedIn);
  const isPrimary = useSelector(GlobalSelectors.isPrimaryAccount);
  const connect = async () => {
    dispatch(globalActions.getAndSetWeb3AuthAccount());
  };
  if (!loggedIn) {
    return isOpen ? (
      <LoginButton fancy className="w-full" />
    ) : (
      <motion.div
        className="relative group mb-3"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div
          onClick={connect}
          className="flex items-center justify-center p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 hover:border-primary/50 transition-all duration-200 cursor-pointer hover:shadow-lg"
        >
          <LogIn className="w-4 h-4 text-primary" />
        </div>
        <motion.div
          className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap"
          initial={{ scale: 0.8, x: -10 }}
          whileHover={{ scale: 1, x: 0 }}
        >
          Sign In
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black" />
        </motion.div>
      </motion.div>
    );
  }
  const openMyProfile = () => {
    router.push(AppPages.profile);
  };

  return (
    <>
      <Separator />

      <motion.div
        className="space-y-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <AnimatePresence mode="wait">
          {isOpen || isMobile ? (
            <motion.div
              className="mb-3 cursor-pointer"
              onClick={openMyProfile}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-accent/50 to-accent/30 border border-accent/50 relative"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.2 }}
              >
                <Img
                  src={myUser?.image}
                  useImgTag
                  className="h-10 w-10 rounded-full"
                  alt={myUser?.name ?? ""}
                />
                {isPrimary && (
                  <Crown className="absolute top-0 right-0 text-yellow-500 h-3 w-3" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {myUser?.name?.includes("@")
                      ? myUser?.name
                      : truncate(myUser?.name ?? "", 10)}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {truncate(myUser?.aptos_address ?? "", 10)}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className="relative group mb-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
            >
              <AppLink href={AppPages.profile} className="p-0.5">
                <div className="flex items-center justify-center p-2 rounded-lg bg-gradient-to-br from-accent/50 to-accent/30 border border-accent/50 relative">
                  <Img
                    src={myUser?.image}
                    useImgTag
                    className="h-4 w-4 rounded-full"
                    alt={myUser?.name ?? ""}
                  />
                  {isPrimary && (
                    <Crown className="absolute top-0 right-0 text-yellow-500 h-3 w-3" />
                  )}
                </div>
              </AppLink>
              <motion.div
                className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap"
                initial={{ scale: 0.8, x: -10 }}
                whileHover={{ scale: 1, x: 0 }}
              >
                {myUser?.name?.includes("@")
                  ? myUser?.name
                  : truncate(myUser?.name ?? "", 10)}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {items.map((item, index) => (
          <SidebarItem key={index} {...item} index={index} />
        ))}
      </motion.div>
    </>
  );
}
