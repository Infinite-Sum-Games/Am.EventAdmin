import { createFileRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { generateNavItems } from "@/lib/nav-manager";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { axiosClient } from "@/lib/axios";
import { api } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({
    beforeLoad: async () => {
        try {
            const response = await axiosClient.get(api.SESSION);
            return {
                user: response.data
            };
        } catch (_error) {
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
                    <div className="flex items-center gap-2">
                        {/* <SidebarTrigger className="-ml-1" /> */}
                        <Separator
                            orientation="vertical"
                            className="mr-2 h-4"
                        />
                    </div>
                    {/* <div className="ml-auto">
                        <ModeToggle />
                    </div> */}
                <main className="p-4">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
