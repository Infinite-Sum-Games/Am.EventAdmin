import { createFileRoute, Link } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Binoculars, PlusCircle, Trash2, Edit3 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Person } from "@/types/db";
import { NewPersonForm } from "@/components/people/new-person-form";

// --- Dummy Data ---
const dummyPeople: Person[] = [
    { id: "uuid-person-1", name: "Dr. Arjun Rao", email: "arjun.rao@univ.edu", profession: "Professor, CSE", phone_number: "9876543210" },
    { id: "uuid-person-2", name: "Meera Krishnan", email: "meera.k@techcorp.com", profession: "Software Engineer, TechCorp", phone_number: "9876543211" },
];

// --- Data Fetching ---
const peopleQueryOptions = queryOptions({
    queryKey: ['people'],
    queryFn: () => dummyPeople,
});

export const Route = createFileRoute('/dashboard/people/')({
    loader: ({ context: { queryClient } }) =>
        queryClient.ensureQueryData(peopleQueryOptions),
    component: PeoplePage,
});

function PeoplePage() {
    const queryClient = useQueryClient();
    const { data: people } = useSuspenseQuery(peopleQueryOptions);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const deletePerson = (personId: string) => {
        alert(`(Simulated) Deleting person with ID: ${personId}`);
    };

    return (
        <div className="flex flex-col gap-4 p-4 pt-0">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">People</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Person</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a New Person</DialogTitle>
                        </DialogHeader>
                        <NewPersonForm onSuccess={() => {
                            setIsDialogOpen(false);
                            queryClient.invalidateQueries({ queryKey: ['people'] });
                        }} />
                    </DialogContent>
                </Dialog>
            </div>

            {(!people || people.length === 0) ? (
                <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md shadow-sm py-8 mt-4">
                    <Binoculars className="w-24 h-24 my-2 text-muted-foreground" />
                    <p className="text-lg font-semibold mt-4">No people found</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {people.map((person) => (
                        <Card key={person.id} className="p-4">
                            <CardContent className="flex justify-between items-center p-0">
                                <div>
                                    <h2 className="text-lg font-semibold">{person.name}</h2>
                                    <p className="text-sm text-muted-foreground">{person.profession}</p>
                                    <div className="flex gap-4 mt-1">
                                        <a href={`mailto:${person.email}`} className="text-xs text-primary hover:underline">{person.email}</a>
                                        <a href={`tel:${person.phone_number}`} className="text-xs text-primary hover:underline">{person.phone_number}</a>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" disabled>
                                        <Edit3 className="w-5 h-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => deletePerson(person.id)}>
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