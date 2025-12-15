import { createFileRoute, Outlet, redirect, Link, useRouterState } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { generateNavItems } from "@/lib/nav-manager";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ModeToggle } from "@/components/ui/theme-toggle"; 
import { axiosClient } from "@/lib/axios";
import { api } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({
    beforeLoad: async () => {
        try {
            const response = await axiosClient.get(api.SESSION);
            return {
                user: response.data
            };
        } catch (error) {
            throw redirect({
                to: "/",
            });
        }
    },
    component: DashboardLayout,
});

function DashboardLayout() {
    const { user: sessionUser } = Route.useRouteContext();
    const routerState = useRouterState();

    const user = {
        name: sessionUser?.name || "Admin",
        email: sessionUser?.email || "admin@example.com",
        avatar: "https://gravatar.com/avatar/dd55aeae8806246ac1d0ab0c6baa34f5?&d=robohash&r=x",
    };

    const navItems = generateNavItems(routerState.location.pathname);

    return (
        <SidebarProvider>
            <AppSidebar user={user} navItems={navItems} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link to="/dashboard">Anokha 2025</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        Dashboard
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="ml-auto">
                        <ModeToggle />
                    </div>
                </header>
                <main className="p-4">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
