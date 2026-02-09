import { api } from "@/lib/api";
import { axiosClient } from "@/lib/axios";
import type { Registration } from "@/types/registrations";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Users } from "lucide-react";
import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RegistrationsTable } from "@/components/registrations/registrations-table";
import { RestrictedAccess } from "@/components/restricted-access";

export const Route = createFileRoute("/dashboard/registrations/")({
  component: RegistrationsOverviewPage,
});

function RegistrationsOverviewPage() {
  const { user: sessionUser } = Route.useRouteContext();
  
  const restrictedEmails = ["finance@amrita.edu", "pnr@amrita.edu"];

  if (restrictedEmails.includes(sessionUser.email)) {
    return <RestrictedAccess />;
  }

  const [sortColumn, setSortColumn] = useState<keyof Registration | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { data: registrations = [], isLoading } = useQuery<Registration[]>({
    queryKey: ["registrations"],
    queryFn: async () => {
      const response = await axiosClient.get(api.FETCH_ALL_STUDENTS);
      return response.data.students || [];
    },
  });

  const handleSortChange = (column: keyof Registration, direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Registrations</h1>
          <p className="text-muted-foreground">
            View all user sign-ups to the website.
          </p>
        </div>
      </div>

      <TooltipProvider>
        {/* Unified Toolbar Component */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Right Side: Registrations count */}
          {registrations.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-lg font-medium">
                {registrations.length} registrations
              </span>
            </div>
          )}
        </div>
      </TooltipProvider>

      {/* Main Content Area */}
      <div>
        {isLoading ? (
          <div className="flex flex-col gap-4 h-[50vh] items-center justify-center text-muted-foreground">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
            <p className="text-sm font-medium">Loading registrations...</p>
          </div>
        ) : registrations.length > 0 ? (
          <RegistrationsTable
            data={registrations}
            loading={isLoading}
            onSortChange={handleSortChange}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            defaultPageSize={25}
          />
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center bg-muted/10 border-2 border-dashed border-muted rounded-xl py-16 mt-4">
            <div className="bg-muted p-4 rounded-full mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No registrations found</h3>
            <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
               No users have signed up yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
