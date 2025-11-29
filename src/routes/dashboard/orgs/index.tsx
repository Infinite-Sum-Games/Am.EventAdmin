import { createFileRoute, Link } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Binoculars, PlusCircle, Trash2, Edit3 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Organizer } from "@/types/db";
import { NewOrgForm } from "@/components/orgs/new-org-form";

// --- Dummy Data ---
const dummyOrgs: Organizer[] = [
    { id: "uuid-org-1", name: "Computer Science and Engineering", email: "cse@univ.edu", org_type: "DEPARTMENT", student_head: "John Doe", faculty_head: "Dr. Smith", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "uuid-org-2", name: "Tech Club", email: "tech@univ.edu", org_type: "CLUB", student_head: "Jane Smith", faculty_head: "Dr. Jones", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
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

function OrgsPage() {
    const queryClient = useQueryClient();
    const { data: orgs } = useSuspenseQuery(orgsQueryOptions);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const deleteOrg = (orgId: string) => {
        alert(`(Simulated) Deleting organizer with ID: ${orgId}`);
        // queryClient.invalidateQueries({ queryKey: ['orgs'] });
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
                <div className="flex flex-col gap-4">
                    {orgs.map((org) => (
                        <Card key={org.id} className="p-4">
                            <CardContent className="flex justify-between items-center p-0">
                                <div className="flex flex-col">
                                    <h2 className="text-lg font-semibold">{org.name}</h2>
                                    <p className="text-sm text-muted-foreground">{org.org_type}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Student Head: {org.student_head}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" disabled>
                                        <Edit3 className="w-5 h-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => deleteOrg(org.id)}>
                                        <Trash2 className="w-5 h-5 text-red-500" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}