import { globalActions } from "app/containers/global/slice";
import {
  HomeIcon,
  LogOutIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutDialog, searchDialog } from "../Dialog";
import { NavigationSection } from "./NavigationSection";
import { QuickActionsSection } from "./QuickActionsSection";
import { Separator } from "./separator";
import { UserSection } from "./UserSection";
import { SidebarItemProps, SidebarProps } from "./types";

export function SidebarContent({ isOpen, isMobile }: SidebarProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentPath = usePathname();
  const isHome = currentPath === "/";
  const isMyOutposts = currentPath === "/my_outposts";
  const isProfile = currentPath === "/profile";
  const isCreateOutpost = currentPath === "/create_outpost";
  const isAllOutposts = currentPath === "/all_outposts";

  const navigationItems: SidebarItemProps[] = [
    {
      index: 0,
      label: "Home",
      icon: HomeIcon,
      onClick: () => {
        router.push("/");
      },
      isOpen: isOpen,
      isMobile: isMobile,
      isActive: isHome,
    },
    {
      index: 1,
      label: "All Outposts",
      imageSrc: "/outpost.png",
      onClick: () => {
        router.push("/all_outposts");
      },
      isOpen: isOpen,
      isMobile: isMobile,
      isActive: isAllOutposts,
    },
    {
      index: 2,
      label: "My Outposts",
      imageSrc: "/flag.png",
      onClick: () => {
        router.push("/my_outposts");
      },
      isOpen: isOpen,
      isMobile: isMobile,
      needsAuth: true,
      isActive: isMyOutposts,
    },
    {
      index: 3,
      label: "Create Outpost",
      icon: PlusIcon,
      onClick: () => {
        router.push("/create_outpost");
      },
      isOpen: isOpen,
      isMobile: isMobile,
      isActive: isCreateOutpost,
    },
    {
      index: 4,
      label: "Profile",
      icon: UserIcon,
      onClick: () => {
        router.push("/profile");
      },
      isOpen: isOpen,
      isMobile: isMobile,
      needsAuth: true,
      isActive: isProfile,
    },
  ];

  const quickActionsItems: SidebarItemProps[] = [
    {
      index: 0,
      label: "Search",
      icon: SearchIcon,
      onClick: async () => {
        await searchDialog({
          title: "Search Everything",
        });
      },
      isOpen: isOpen,
      isMobile: isMobile,
    },
  ];

  const userItems: SidebarItemProps[] = [
    {
      index: 0,
      label: "Logout",
      icon: LogOutIcon,
      onClick: async () => {
        const confirmed = await logoutDialog();
        if (confirmed) {
          dispatch(globalActions.logout());
        }
      },
      isOpen: isOpen,
      isMobile: isMobile,
      isDanger: true,
    },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 overflow-hidden relative z-10">
      <NavigationSection
        isOpen={isOpen}
        isMobile={isMobile}
        items={navigationItems}
      />
      <Separator />
      <QuickActionsSection
        isOpen={isOpen}
        isMobile={isMobile}
        items={quickActionsItems}
      />
      <div className="flex-1" />
      <UserSection isOpen={isOpen} isMobile={isMobile} items={userItems} />
    </div>
  );
}
