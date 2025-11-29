import { ChevronRight, type LucideIcon } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import type { NavItem } from "@/lib/nav-manager";

// Helper component to render a collapsible group of navigation items
function NavItemGroup({ items }: { items: NavItem[] }) {
    return (
        <SidebarMenu>
            {items.map((item) => (
                <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                >
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {item.items?.map((subItem) => (
                                    <SidebarMenuSubItem key={subItem.title}>
                                        <SidebarMenuSubButton
                                            isActive={subItem.isActive}
                                            asChild
                                        >
                                            <Link to={subItem.url} search={{}} params={{}}>
                                                <span>{subItem.title}</span>
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
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
                        <Link to={dashboardItem.url} className="w-full">
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
