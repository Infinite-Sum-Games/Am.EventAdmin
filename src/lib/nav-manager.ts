import {
    LayoutDashboard,
    CalendarDays,
    Users,
    Megaphone,
    IndianRupee,
    Tags,
    Shield,
    type LucideIcon
} from "lucide-react";

export const dashboardNavItem = {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
};

export const managementNavItems = [
    {
        title: "Events",
        url: "/dashboard/events",
        icon: CalendarDays,
        items: [
            {
                title: "View Events",
                url: "/dashboard", // The main dashboard is the event view
            },
            {
                title: "New Event",
                url: "/dashboard/events/new",
            },
        ],
    },
    {
        title: "Participants",
        url: "/dashboard/participants",
        icon: Users,
        items: [
            {
                title: "Search All",
                url: "/dashboard/participants/search",
            },
            {
                title: "By Event",
                url: "/dashboard/participants",
            },
        ],
    },
    {
        title: "Announcements",
        url: "/dashboard/announcements",
        icon: Megaphone,
        items: [
            {
                title: "View All",
                url: "/dashboard/announcements",
            },
            {
                title: "New Announcement",
                url: "/dashboard/announcements/new",
            },
        ],
    },
    {
        title: "Revenue",
        url: "/dashboard/revenue",
        icon: IndianRupee,
        items: [
            {
                title: "Overview",
                url: "/dashboard/revenue",
            },
            {
                title: "Transactions",
                url: "/dashboard/revenue/transactions",
            },
        ],
    },
    {
        title: "Tags",
        url: "/dashboard/tags",
        icon: Tags,
        items: [
            {
                title: "View All",
                url: "/dashboard/tags",
            },
            {
                title: "New Tag",
                url: "/dashboard/tags/new",
            },
        ],
    },
    {
        title: "Organizers",
        url: "/dashboard/orgs",
        icon: Shield,
        items: [
            {
                title: "View All",
                url: "/dashboard/orgs",
            },
            {
                title: "New Organizer",
                url: "/dashboard/orgs/new",
            },
        ],
    },
];

// This function dynamically sets the 'isActive' state based on the current URL
export function generateNavItems(pathname: string) {
    
    // The main dashboard link is active only if the path is exactly "/dashboard"
    const isDashboardActive = pathname === dashboardNavItem.url;

    const activeManagementItems = managementNavItems.map(item => {
        // A parent item is active if the current path starts with its base URL,
        // but is not the main dashboard page (to avoid highlighting "Events" and "Dashboard" at the same time).
        const isParentActive = pathname.startsWith(item.url) && item.url !== '/dashboard';
        
        return {
            ...item,
            isActive: isParentActive,
            items: item.items?.map(subItem => ({
                ...subItem,
                isActive: subItem.url === pathname,
            })),
        };
    });

    return [
        { ...dashboardNavItem, isActive: isDashboardActive, items: [] },
        ...activeManagementItems,
    ];
}