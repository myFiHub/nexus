import { NavigationSection } from "./NavigationSection";
import { QuickActionsSection } from "./QuickActionsSection";
import { Separator } from "./Separator";
import { UserSection } from "./UserSection";
import { SidebarProps } from "./types";

export function SidebarContent({ isOpen, isMobile }: SidebarProps) {
  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden relative z-10">
      <NavigationSection isOpen={isOpen} isMobile={isMobile} />
      <Separator />
      <QuickActionsSection isOpen={isOpen} isMobile={isMobile} />
      <div className="flex-1" />
      <Separator />
      <UserSection isOpen={isOpen} isMobile={isMobile} />
    </div>
  );
}
