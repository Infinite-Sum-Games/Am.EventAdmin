import { ChevronRight } from "lucide-react";
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


// This component now intelligently renders either a direct link or a collapsible menu
function NavItemGroup({ items }: { items: NavItem[] }) {
    return (
        <SidebarMenu>
            {items.map((item) => {
                // If there are no sub-items, render a direct link
                if (!item.items || item.items.length === 0) {
                    return (
                        <SidebarMenuItem key={item.title}>
                            <Link to={item.url} className="w-full" search={{}} params={{}}>
                                <SidebarMenuButton isActive={item.isActive} tooltip={item.title}>
                                    {item.icon && <item.icon />}
                                    <span className="flex-grow">{item.title}</span>
                                    {/* {showNew.includes(item.title) && <span className="ping ml-auto" />} */}
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    );
                }

                // If there ARE sub-items, render a collapsible menu
                return (
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
                                    {item.items.map((subItem) => (
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
                );
            })}
        </SidebarMenu>
    );
}

export function NavMain({
    dashboardItem,
    managementItems,
}: {
    dashboardItem: NavItem;
    managementItems: NavItem[];
}) {
    return (
        <>
            {/* Dashboard Link is always a direct link */}
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

            <SidebarGroup>
                <SidebarGroupLabel>Management</SidebarGroupLabel>
                <NavItemGroup items={managementItems} />
            </SidebarGroup>
        </>
    );
}
