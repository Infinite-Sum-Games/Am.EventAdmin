import {
    Bell,
    Bot,
    IndianRupee,
    Settings2,
    SquareTerminal,
} from "lucide-react";

const navItems = [
    {
        title: "Events",
        url: "/dashboard",
        icon: Bot,
        items: [
            {
                title: "View Events",
                url: "/dashboard",
            },
            {
                title: "New Event",
                url: "/dashboard/events/new",
            },
            {
                title: "Toggle Event Status",
                url: "/dashboard/events/toggle",
            },
        ],
    },
    {
        title: "Participants",
        url: "/dashboard/participants",
        icon: Settings2,
        items: [
            {
                title: "Search",
                url: "/dashboard/participants/search",
            },
            {
                title: "Event-Wise",
                url: "/dashboard/participants",
            },
        ],
    },
    {
        title: "Announcements",
        url: "/dashboard/announcements",
        icon: Bell,
        items: [
            {
                title: "View Announcements",
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
                title: "Monitor",
                url: "/dashboard/revenue",
            },
            {
                title: "View Transactions",
                url: "/dashboard/revenue/transactions",
            },
        ],
    },
    {
        title: "Tags",
        url: "/dashboard/tags",
        icon: SquareTerminal,
        items: [
            {
                title: "View Tags",
                url: "/dashboard/tags",
            },
            {
                title: "New Tag",
                url: "/dashboard/tags/new",
            },
        ],
    },
    {
        title: "Event Organizers",
        url: "/dashboard/orgs",
        icon: SquareTerminal,
        items: [
            {
                title: "View Organizers",
                url: "/dashboard/orgs",
            },
            {
                title: "New Organizer",
                url: "/dashboard/orgs/new",
            },
        ],
    },
];

export function generateNavItems(itemUrl: string, subItemUrl: string) {
    return navItems.map((item) => {
        const isActive = item.url === itemUrl;
        return {
            ...item,
            isActive,
            items: item.items?.map((subItem) => ({
                ...subItem,
                isActive: subItem.url === subItemUrl,
            })),
        };
    });
}
