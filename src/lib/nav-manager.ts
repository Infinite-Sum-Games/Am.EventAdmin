import {
    LayoutDashboard, CalendarDays, Users, Shield, Tags, Contact,
    IndianRupee, GraduationCap, type LucideIcon
} from "lucide-react";

export type NavItem = {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: { // This is now optional
        title: string;
        url: string;
        isActive?: boolean;
    }[];
};

export const dashboardNavItem: NavItem = {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
};

// --- Navigation Structure Definition ---

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

export function generateNavItems(pathname: string) {
    const applyActiveState = (items: NavItem[]) => {
        return items.map(item => {
            // A parent is active if the path starts with its URL.
            // A special case for "Events" which links to "/dashboard"
            const isParentActive = item.url === '/dashboard' 
                ? pathname === '/dashboard' || pathname.startsWith('/dashboard/events')
                : pathname.startsWith(item.url);
            
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
        dashboard: { ...dashboardNavItem, isActive: pathname === dashboardNavItem.url && !pathname.startsWith('/dashboard/events') },
        management: applyActiveState(managementNavItems),
        analytics: applyActiveState(analyticsNavItems),
    };
}
