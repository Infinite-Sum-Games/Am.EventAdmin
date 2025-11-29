import {
    LayoutDashboard, CalendarDays, Users, Shield, Tags, Contact,
    IndianRupee, GraduationCap, type LucideIcon
} from "lucide-react";

export type NavItem = {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
};

export const dashboardNavItem: NavItem = {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
};

export const managementNavItems: NavItem[] = [
    {
        title: "Events",
        url: "/dashboard", // Main dashboard is the events view
        icon: CalendarDays,
    },
    {
        title: "Organizers",
        url: "/dashboard/orgs",
        icon: Shield,
    },
    {
        title: "Tags",
        url: "/dashboard/tags",
        icon: Tags,
    },
    {
        title: "People",
        url: "/dashboard/people",
        icon: Contact,
    },
];

export const analyticsNavItems: NavItem[] = [
    {
        title: "Revenue",
        url: "/dashboard/revenue",
        icon: IndianRupee,
    },
    {
        title: "Participants",
        url: "/dashboard/participants",
        icon: Users,
    },
    {
        title: "Students",
        url: "/dashboard/students",
        icon: GraduationCap,
    },
];

export function generateNavItems(pathname: string) {
    const applyActiveState = (items: NavItem[]) => {
        return items.map(item => {
            return {
                ...item,
                isActive: pathname === item.url || (pathname.startsWith(item.url) && item.url !== "/dashboard" && item.url !== "/dashboard/events"), // Simplified active check
            };
        });
    };

    return {
        dashboard: { ...dashboardNavItem, isActive: pathname === dashboardNavItem.url },
        management: applyActiveState(managementNavItems),
        analytics: applyActiveState(analyticsNavItems),
    };
}