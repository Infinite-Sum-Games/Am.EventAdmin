import { type LucideIcon } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import type { NavItem } from "@/lib/nav-manager";

// Helper component to render a list of direct nav items
function NavItemGroup({ items }: { items: NavItem[] }) {
    return (
        <SidebarMenu>
            {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                    <Link to={item.url} className="w-full" search={{}} params={{}}> {/* Added search/params for type-safety */}
                        <SidebarMenuButton isActive={item.isActive} tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}

export function NavMain({
    dashboardItem,
    managementItems,
    analyticsItems,
}: {
    dashboardItem: NavItem;
    managementItems: NavItem[];
    analyticsItems: NavItem[];
}) {
    return (
        <>
            {/* Dashboard Link */}
            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link to={dashboardItem.url} className="w-full" search={{}} params={{}}>
                            <SidebarMenuButton isActive={dashboardItem.isActive} tooltip={dashboardItem.title}>
                                {dashboardItem.icon && <dashboardItem.icon />}
                                <span>{dashboardItem.title}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>

            {/* Management Group */}
            <SidebarGroup>
                <SidebarGroupLabel>Management</SidebarGroupLabel>
                <NavItemGroup items={managementItems} />
            </SidebarGroup>

            {/* Analytics Group */}
            <SidebarGroup>
                <SidebarGroupLabel>Analytics</SidebarGroupLabel>
                <NavItemGroup items={analyticsItems} />
            </SidebarGroup>
        </>
    );
}