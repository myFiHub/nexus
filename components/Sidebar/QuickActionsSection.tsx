import { motion } from "framer-motion";
import { BellIcon, PlusIcon, SearchIcon, SettingsIcon } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SidebarItem } from "./SidebarItem";
import { SidebarProps } from "./types";

export function QuickActionsSection({ isOpen, isMobile }: SidebarProps) {
  return (
    <motion.div
      className="space-y-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <SectionHeader
        title="Quick Actions"
        isOpen={isOpen}
        isMobile={isMobile}
      />

      <div className="space-y-1">
        <SidebarItem
          href="/search"
          icon={SearchIcon}
          label="Search"
          index={5}
          isOpen={isOpen}
          isMobile={isMobile}
        />
        <SidebarItem
          href="/notifications"
          icon={BellIcon}
          label="Notifications"
          index={6}
          isOpen={isOpen}
          isMobile={isMobile}
        />
        <SidebarItem
          href="/create_outpost"
          icon={PlusIcon}
          label="Create Outpost"
          index={7}
          isOpen={isOpen}
          isMobile={isMobile}
        />
        <SidebarItem
          href="/settings"
          icon={SettingsIcon}
          label="Settings"
          index={8}
          isOpen={isOpen}
          isMobile={isMobile}
        />
      </div>
    </motion.div>
  );
}
