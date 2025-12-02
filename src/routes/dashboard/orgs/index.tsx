import { createFileRoute } from "@tanstack/react-router";
import {
  queryOptions,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Binoculars,
  PlusCircle,
  Trash2,
  Edit3,
  Building,
  Users,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrganizerType } from "@/types/db";
import { NewOrgForm } from "@/components/orgs/new-org-form";
import { api } from "@/lib/api";
import secureLocalStorage from "react-secure-storage";
import type { GetAllOrganizersResponse } from "@/types/organizers";
// --- Dummy Data ---
// const dummyOrgs: Organizer[] = [
//     { id: "uuid-org-1", name: "Computer Science and Engineering", email: "cse@univ.edu", organizer_type: "DEPARTMENT", student_head: "John Doe", faculty_head: "Dr. Smith", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
//     { id: "uuid-org-2", name: "Tech Club", email: "tech@univ.edu", organizer_type: "CLUB", student_head: "Jane Smith", faculty_head: "Dr. Jones", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
//     { id: "uuid-org-3", name: "Mechanical Engineering", email: "mech@univ.edu", organizer_type: "DEPARTMENT", student_head: "Peter Pan", faculty_head: "Dr. Hook", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
// ];

// --- Data Fetching ---
const orgsQueryOptions = queryOptions({
  queryKey: ["orgs"],
  queryFn: async () => {
    const token = secureLocalStorage.getItem("t");
    if (!token) {
      throw new Error("No auth token found");
    }
    const res = await fetch(api.FETCH_ALL_ORGANIZERS, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch organizers");
    }
    const data: GetAllOrganizersResponse = await res.json();
    console.log("Fetched organizers:", data.organizers);
    return data.organizers;
  },
});

export const Route = createFileRoute("/dashboard/orgs/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(orgsQueryOptions),
  component: OrgsPage,
});

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

function OrgsPage() {
  const queryClient = useQueryClient();
  const { data: orgs } = useSuspenseQuery(orgsQueryOptions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<OrganizerType | "ALL">("ALL");

  const filteredOrgs = useMemo(() => {
    if (typeFilter === "ALL") {
      return orgs;
    }
    return orgs.filter((org) => org.organizer_type === typeFilter);
  }, [orgs, typeFilter]);

  const deleteOrg = (orgId: string) => {
    alert(`(Simulated) Deleting organizer with ID: ${orgId}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Organizers</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Select
            value={typeFilter}
            onValueChange={(value) =>
              setTypeFilter(value as OrganizerType | "ALL")
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Organizers</SelectItem>
              <SelectItem value="DEPARTMENT">Department</SelectItem>
              <SelectItem value="CLUB">Club</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> Create
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Organizer</DialogTitle>
              </DialogHeader>
              <NewOrgForm
                onSuccess={() => {
                  setIsDialogOpen(false);
                  queryClient.invalidateQueries({ queryKey: ["orgs"] });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!filteredOrgs || filteredOrgs.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md shadow-xs py-8 mt-4">
          <Binoculars className="w-24 h-24 my-2 text-muted-foreground" />
          <p className="text-lg font-semibold mt-4">
            No organizers found for this filter.
          </p>
        </div>
      ) : (
        <Card>
          <div className="flex flex-col">
            {filteredOrgs.map((org, index) => (
              <div key={org.id}>
                <div className="flex items-center gap-4 p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {getInitials(org.organizer_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{org.organizer_name}</p>
                      <Badge
                        variant={
                          org.organizer_type === "DEPARTMENT"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {org.organizer_type === "DEPARTMENT" ? (
                          <Building className="mr-1 h-3 w-3" />
                        ) : (
                          <Users className="mr-1 h-3 w-3" />
                        )}
                        {org.organizer_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Student Head: {org.student_head}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" disabled>
                      <Edit3 className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteOrg(org.id)}
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </Button>
                  </div>
                </div>
                {index < filteredOrgs.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
