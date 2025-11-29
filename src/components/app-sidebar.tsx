import * as React from "react";
import { GalleryVerticalEnd, type LucideIcon } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";

// Define a consistent NavItem type to be used across components
type NavItem = {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
        title: string;
        url: string;
        isActive?: boolean;
    }[];
};

export function AppSidebar({
    user,
    navItems,
    ...props
}: {
    user: {
        name: string;
        email: string;
        avatar: string;
    };
    navItems: NavItem[];
} & React.ComponentProps<typeof Sidebar>) {
    // The first item from our generator is the dashboard link, the rest are management sections
    const dashboardItem = navItems[0];
    const managementItems = navItems.slice(1);
    
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher
                    teams={[
                        {
                            name: "Anokha 2025",
                            logo: GalleryVerticalEnd,
                            plan: "Organizing Team",
                        },
                    ]}
                />
            </SidebarHeader>
            <SidebarContent>
                <NavMain dashboardItem={dashboardItem} managementItems={managementItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}