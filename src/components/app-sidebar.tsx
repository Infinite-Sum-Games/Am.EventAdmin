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
import { Route } from "@/routes/dashboard"; // Import Route from the dashboard route to access context

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
    };
} & React.ComponentProps<typeof Sidebar>) {
    const { user: sessionUser } = Route.useRouteContext(); // Get session user

    const filteredManagementItems = React.useMemo(() => {
        if (sessionUser.email === "finance@amrita.edu") {
            // If finance user, show only the dashboard item, so management items are empty
            return [];
        }
        return navItems.management;
    }, [sessionUser.email, navItems.management]);


    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher
                    teams={[
                        {
                            name: "Anokha 2026",
                            logo: GalleryVerticalEnd,
                            plan: "Organizing Team",
                        },
                    ]}
                />
            </SidebarHeader>
            <SidebarContent>
                <NavMain 
                    dashboardItem={navItems.dashboard} 
                    managementItems={filteredManagementItems} // Pass filtered items
                />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
