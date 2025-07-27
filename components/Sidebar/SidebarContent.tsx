import { globalActions } from "app/containers/global/slice";
import { AppPages } from "app/lib/routes";
import {
  HomeIcon,
  LayoutDashboard,
  LogOutIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutDialog, searchDialog } from "../Dialog";
import { setRoutingEventBusId } from "../listeners/loading/eventBus";
import { NavigationSection } from "./NavigationSection";
import { QuickActionsSection } from "./QuickActionsSection";
import { Separator } from "./separator";
import { SidebarItemProps, SidebarProps } from "./types";
import { UserSection } from "./UserSection";

export function SidebarContent({ isOpen, isMobile }: SidebarProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentPath = usePathname();
  const isHome = currentPath === "/";
  const isMyOutposts = currentPath === AppPages.myOutposts;
  const isProfile = currentPath === AppPages.profile;
  const isCreateOutpost = currentPath === AppPages.createOutpost;
  const isAllOutposts = currentPath === AppPages.allOutposts;
  const isDashboard = currentPath === AppPages.dashboard;

  const navigationItems: SidebarItemProps[] = [
    {
      index: 0,
      label: "Home",
      icon: HomeIcon,
      onClick: () => {
        setRoutingEventBusId("Home");
        router.push("/");
      },
      isOpen: isOpen,
      isMobile: isMobile,
      isActive: isHome,
    },
    {
      index: 1,
      label: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => {
        setRoutingEventBusId("Dashboard");
        router.push("/dashboard");
      },
      isOpen: isOpen,
      isMobile: isMobile,
      isActive: isDashboard,
    },
    {
      index: 2,
      label: "All Outposts",
      imageSrc: "/outpost.png",
      onClick: () => {
        setRoutingEventBusId("All Outposts");
        router.push(AppPages.allOutposts);
      },
      isOpen: isOpen,
      isMobile: isMobile,
      isActive: isAllOutposts,
    },
    {
      index: 3,
      label: "My Outposts",
      imageSrc: "/flag.png",
      onClick: () => {
        setRoutingEventBusId("My Outposts");
        router.push(AppPages.myOutposts);
      },
      isOpen: isOpen,
      isMobile: isMobile,
      needsAuth: true,
      isActive: isMyOutposts,
    },
    {
      index: 4,
      label: "Create Outpost",
      icon: PlusIcon,
      onClick: () => {
        setRoutingEventBusId("Create Outpost");
        router.push(AppPages.createOutpost);
      },
      isOpen: isOpen,
      isMobile: isMobile,
      isActive: isCreateOutpost,
    },
    {
      index: 5,
      label: "Profile",
      icon: UserIcon,
      onClick: () => {
        setRoutingEventBusId("Profile");
        router.push(AppPages.profile);
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
