import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";
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
import type { NavItem } from "@/lib/nav-manager";

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
    navItems: {
        dashboard: NavItem;
        management: NavItem[];
        analytics: NavItem[];
    };
} & React.ComponentProps<typeof Sidebar>) {
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
                <NavMain 
                    dashboardItem={navItems.dashboard} 
                    managementItems={navItems.management}
                    analyticsItems={navItems.analytics}
                />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
