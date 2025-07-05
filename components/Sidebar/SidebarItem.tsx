import { AnimatePresence, motion } from "framer-motion";
import { SidebarItemProps } from "./types";

export function SidebarItem({
  href,
  icon: Icon,
  label,
  tooltip,
  index,
  isOpen,
  isMobile,
}: SidebarItemProps) {
  return (
    <motion.div
      className="relative group min-h-10"
      whileHover={{
        scale: 1.02,
        x: isOpen ? 5 : 0,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.a
        href={href}
        className="flex items-center rounded hover:bg-accent relative overflow-hidden"
        style={{
          padding: "8px",
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          whileHover={{ rotate: 360 }}
          className="shrink-0 relative z-10"
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Icon className="h-5 w-5" />
        </motion.div>

        <AnimatePresence>
          {(isOpen || isMobile) && (
            <motion.span
              className="truncate relative z-10 ml-3"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{
                duration: 0.2,
                delay: isOpen ? 0.1 : 0,
              }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.a>

      <AnimatePresence>
        {!isOpen && !isMobile && (
          <motion.div
            className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap"
            initial={{ scale: 0.8, x: -10 }}
            animate={{ scale: 1, x: 0 }}
            exit={{ scale: 0.8, x: -10 }}
          >
            {tooltip || label}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-black" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
