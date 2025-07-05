import { motion } from "framer-motion";
import { HomeIcon, MapIcon, PlusIcon, UserIcon } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SidebarItem } from "./SidebarItem";
import { SidebarProps } from "./types";

export function NavigationSection({ isOpen, isMobile }: SidebarProps) {
  return (
    <motion.div
      className="space-y-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <SectionHeader title="Navigation" isOpen={isOpen} isMobile={isMobile} />

      <div className="space-y-1">
        <SidebarItem
          href="/"
          icon={HomeIcon}
          label="Home"
          index={0}
          isOpen={isOpen}
          isMobile={isMobile}
        />
        <SidebarItem
          href="/my_outposts"
          icon={MapIcon}
          label="My Outposts"
          index={2}
          isOpen={isOpen}
          isMobile={isMobile}
        />
        <SidebarItem
          href="/create_outpost"
          icon={PlusIcon}
          label="Create Outpost"
          index={3}
          isOpen={isOpen}
          isMobile={isMobile}
        />
        <SidebarItem
          href="/profile"
          icon={UserIcon}
          label="Profile"
          index={4}
          isOpen={isOpen}
          isMobile={isMobile}
        />
      </div>
    </motion.div>
  );
}
