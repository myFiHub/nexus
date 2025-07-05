import { LucideIcon } from "lucide-react";

export interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
}

export interface SidebarItemData {
  href: string;
  icon: LucideIcon;
  label: string;
  tooltip?: string;
  index: number;
}

export interface SidebarItemProps extends SidebarItemData, SidebarProps {}

export interface SectionHeaderProps extends SidebarProps {
  title: string;
}

export interface TriggerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  controls: any;
}
