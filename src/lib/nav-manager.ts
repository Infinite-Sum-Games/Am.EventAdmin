import {
    LayoutDashboard, CalendarDays, Users, Shield, Tags, Contact,
    BarChart3, // Representing Analytics
    IndianRupee, GraduationCap, type LucideIcon
} from "lucide-react";

// A consistent type for all navigation items
export type NavItem = {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
        title: string;
        url: string;
        isActive?: boolean;
    }[];
};

// --- Navigation Structure Definition ---

export const dashboardNavItem: NavItem = {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
};

export const managementNavItems: NavItem[] = [
    {
        title: "Events",
        url: "/dashboard/events",
        icon: CalendarDays,
        items: [
            { title: "View All", url: "/dashboard" },
            { title: "New Event", url: "/dashboard/events/new" },
        ],
    },
    {
        title: "Organizers",
        url: "/dashboard/orgs",
        icon: Shield,
        items: [
            { title: "View All", url: "/dashboard/orgs" },
        ],
    },
    {
        title: "Tags",
        url: "/dashboard/tags",
        icon: Tags,
        items: [
            { title: "View All", url: "/dashboard/tags" },
        ],
    },
    {
        title: "People",
        url: "/dashboard/people",
        icon: Contact,
        items: [
            { title: "View All", url: "/dashboard/people" },
        ],
    },
];

export const analyticsNavItems: NavItem[] = [
    {
        title: "Revenue",
        url: "/dashboard/revenue",
        icon: IndianRupee,
        items: [
            { title: "Overview", url: "/dashboard/revenue" },
            { title: "Transactions", url: "/dashboard/revenue/transactions" },
        ],
    },
    {
        title: "Participants",
        url: "/dashboard/participants",
        icon: Users,
        items: [
            { title: "By Event", url: "/dashboard/participants" },
            { title: "Search All", url: "/dashboard/participants/search" },
        ],
    },
    {
        title: "Students",
        url: "/dashboard/students",
        icon: GraduationCap,
        items: [
            { title: "Overview", url: "/dashboard/students" },
        ],
    },
];

/**
 * Processes the navigation items to set the active state based on the current URL.
 * @param pathname The current URL pathname from the router.
 * @returns An object containing the structured and state-aware navigation items.
 */
export function generateNavItems(pathname: string) {
    const applyActiveState = (items: NavItem[]) => {
        return items.map(item => {
            const isParentActive = pathname.startsWith(item.url) && item.url !== dashboardNavItem.url;
            return {
                ...item,
                isActive: isParentActive,
                items: item.items?.map(subItem => ({
                    ...subItem,
                    isActive: subItem.url === pathname,
                })),
            };
        });
    };

    return {
        dashboard: { ...dashboardNavItem, isActive: pathname === dashboardNavItem.url },
        management: applyActiveState(managementNavItems),
        analytics: applyActiveState(analyticsNavItems),
    };
}
