import { AnimatePresence, motion } from "framer-motion";
import { LogOutIcon, UserIcon } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { SidebarProps } from "./types";

export function UserSection({ isOpen, isMobile }: SidebarProps) {
  return (
    <motion.div
      className="space-y-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      <AnimatePresence mode="wait">
        {isOpen || isMobile ? (
          <motion.div
            className="mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-sm font-semibold text-muted-foreground mb-2">
              User
            </h2>
            <motion.div
              className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-accent/50 to-accent/30 border border-accent/50"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <UserIcon className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">
                  john@example.com
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
            <div className="flex items-center justify-center p-2 rounded-lg bg-gradient-to-br from-accent/50 to-accent/30 border border-accent/50">
              <motion.div
                className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <UserIcon className="h-5 w-5 text-primary-foreground" />
              </motion.div>
            </div>
            <motion.div
              className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap"
              initial={{ scale: 0.8, x: -10 }}
              whileHover={{ scale: 1, x: 0 }}
            >
              John Doe
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SidebarItem
        href="/logout"
        icon={LogOutIcon}
        label="Logout"
        index={9}
        isOpen={isOpen}
        isMobile={isMobile}
      />
    </motion.div>
  );
}
