import {
    LayoutDashboard, CalendarDays, Shield, Tags, Contact,
    IndianRupee, type LucideIcon,
    ArrowRightLeft
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

export const managementNavItems: NavItem[] = [
    {
        title: "Events",
        url: "/dashboard/events",
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
        title: "Dignitaries",
        url: "/dashboard/people",
        icon: Contact,
    },
    {
        title: "Transactions",
        url: "/dashboard/transactions",
        icon: ArrowRightLeft,
    },
    {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: IndianRupee,
    }
];

export const analyticsNavItems: NavItem[] = [];

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
