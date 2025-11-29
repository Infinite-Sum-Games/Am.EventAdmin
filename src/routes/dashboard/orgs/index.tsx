import { createFileRoute } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Binoculars, PlusCircle, Trash2, Edit3, Building, Users } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Organizer } from "@/types/db";
import { NewOrgForm } from "@/components/orgs/new-org-form";

// --- Dummy Data ---
const dummyOrgs: Organizer[] = [
    { id: "uuid-org-1", name: "Computer Science and Engineering", email: "cse@univ.edu", org_type: "DEPARTMENT", student_head: "John Doe", faculty_head: "Dr. Smith", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "uuid-org-2", name: "Tech Club", email: "tech@univ.edu", org_type: "CLUB", student_head: "Jane Smith", faculty_head: "Dr. Jones", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "uuid-org-3", name: "Mechanical Engineering", email: "mech@univ.edu", org_type: "DEPARTMENT", student_head: "Peter Pan", faculty_head: "Dr. Hook", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// --- Data Fetching ---
const orgsQueryOptions = queryOptions({
    queryKey: ['orgs'],
    queryFn: () => dummyOrgs,
});

export const Route = createFileRoute('/dashboard/orgs/')({
    loader: ({ context: { queryClient } }) =>
        queryClient.ensureQueryData(orgsQueryOptions),
    component: OrgsPage,
});

// Helper to get initials from a name
const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function OrgsPage() {
    const queryClient = useQueryClient();
    const { data: orgs } = useSuspenseQuery(orgsQueryOptions);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const deleteOrg = (orgId: string) => {
        alert(`(Simulated) Deleting organizer with ID: ${orgId}`);
    };

    return (
        <div className="flex flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Organizers</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Create New Organizer</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a New Organizer</DialogTitle>
                        </DialogHeader>
                        <NewOrgForm onSuccess={() => {
                            setIsDialogOpen(false);
                            queryClient.invalidateQueries({ queryKey: ['orgs'] });
                        }} />
                    </DialogContent>
                </Dialog>
            </div>

            {(!orgs || orgs.length === 0) ? (
                <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md shadow-sm py-8 mt-4">
                    <Binoculars className="w-24 h-24 my-2 text-muted-foreground" />
                    <p className="text-lg font-semibold mt-4">No organizers found</p>
                </div>
            ) : (
                <Card>
                    <div className="flex flex-col">
                        {orgs.map((org, index) => (
                            <div key={org.id}>
                                <div className="flex items-center gap-4 p-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback>{getInitials(org.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid gap-1 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold">{org.name}</p>
                                            <Badge variant={org.org_type === 'DEPARTMENT' ? 'default' : 'secondary'}>
                                                {org.org_type === 'DEPARTMENT' ? <Building className="mr-1 h-3 w-3"/> : <Users className="mr-1 h-3 w-3" />}
                                                {org.org_type}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Student Head: {org.student_head}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" disabled>
                                            <Edit3 className="w-5 h-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => deleteOrg(org.id)}>
                                            <Trash2 className="w-5 h-5 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                                {index < orgs.length - 1 && <Separator />}
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
