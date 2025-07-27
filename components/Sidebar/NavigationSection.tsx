import { GlobalSelectors } from "app/containers/global/selectors";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { SectionHeader } from "./SectionHeader";
import { SidebarItem } from "./SidebarItem";
import { SidebarSectionProps } from "./types";

export function NavigationSection({
  isOpen,
  isMobile,
  items,
}: SidebarSectionProps) {
  const loggedIn = useSelector(GlobalSelectors.isLoggedIn);
  return (
    <motion.div
      className="space-y-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <SectionHeader title="Navigation" isOpen={isOpen} isMobile={isMobile} />

      <div className="space-y-1">
        {items.map((item) => {
          if (item.needsAuth && !loggedIn) {
            return null;
          }
          return <SidebarItem key={item.index} {...item} />;
        })}
      </div>
    </motion.div>
  );
}
