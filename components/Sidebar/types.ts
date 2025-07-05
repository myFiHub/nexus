import { LucideIcon } from "lucide-react";

export interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
}

export interface SidebarSectionProps {
  isOpen: boolean;
  isMobile: boolean;
  items: SidebarItemProps[];
}

export interface SidebarItemData {
  onClick: () => void;
  icon: LucideIcon;
  label: string;
  tooltip?: string;
  index: number;
  needsAuth?: boolean;
  isOpen: boolean;
  isMobile: boolean;
  loading?: boolean;
  isActive?: boolean;
}

export interface SidebarItemProps extends SidebarItemData {}

export interface SectionHeaderProps extends SidebarProps {
  title: string;
}

export interface TriggerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  controls: any;
  isMobile?: boolean;
  hasBeenClicked?: boolean;
}
