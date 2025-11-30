import { createFileRoute } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Binoculars, PlusCircle, Trash2, Edit3, Mail, Phone } from "lucide-react";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Import Input for search bar
import type { Person } from "@/types/db";
import { NewPersonForm } from "@/components/people/new-person-form";

// --- Dummy Data ---
const dummyPeople: Person[] = [
    { id: "uuid-person-1", name: "Dr. Arjun Rao", email: "arjun.rao@univ.edu", profession: "Professor, CSE", phone_number: "9876543210" },
    { id: "uuid-person-2", name: "Meera Krishnan", email: "meera.k@techcorp.com", profession: "Software Engineer, TechCorp", phone_number: "9876543211" },
    { id: "uuid-person-3", name: "Sunil Verma", email: "sunil.v@startup.io", profession: "Product Manager, Startup.io", phone_number: "9876543212" },
    { id: "uuid-person-4", name: "Priya Sharma", email: "priya.s@design.co", profession: "UI/UX Designer", phone_number: "9876543213" },
    { id: "uuid-person-5", name: "Rahul Gupta", email: "rahul.g@consult.com", profession: "Consultant", phone_number: "9876543214" },
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

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

function PeoplePage() {
    const queryClient = useQueryClient();
    const { data: people } = useSuspenseQuery(peopleQueryOptions);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPeople = useMemo(() => {
        if (!searchTerm) {
            return people;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return people.filter(person =>
            person.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            (person.email && person.email.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (person.profession && person.profession.toLowerCase().includes(lowerCaseSearchTerm))
        );
    }, [people, searchTerm]);

    const deletePerson = (personId: string) => {
        alert(`(Simulated) Deleting person with ID: ${personId}`);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-semibold">People</h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Search by name, email, or profession..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:max-w-xs"
                    />
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto"><PlusCircle className="h-4 w-4" /> Add New Person</Button>
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
            </div>

            {(!filteredPeople || filteredPeople.length === 0) ? (
                <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md shadow-xs py-8 mt-4">
                    <Binoculars className="w-24 h-24 my-2 text-muted-foreground" />
                    <p className="text-lg font-semibold mt-4">No people found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPeople.map((person) => (
                        <Card key={person.id} className="flex flex-col text-center">
                            <CardHeader className="flex flex-col items-center">
                                <Avatar className="h-20 w-20 mb-2 text-xl">
                                    <AvatarFallback>{getInitials(person.name)}</AvatarFallback>
                                </Avatar>
                                <h2 className="text-xl font-semibold">{person.name}</h2>
                                <p className="text-sm text-muted-foreground">{person.profession}</p>
                            </CardHeader>
                            <CardContent className="grow">
                                <div className="flex flex-col gap-2 text-sm">
                                    <a href={`mailto:${person.email}`} className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary">
                                        <Mail className="h-4 w-4" />
                                        <span>{person.email}</span>
                                    </a>
                                    <a href={`tel:${person.phone_number}`} className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary">
                                        <Phone className="h-4 w-4" />
                                        <span>{person.phone_number}</span>
                                    </a>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2 p-4 border-t">
                                <Button variant="outline" className="flex-1" disabled>
                                    <Edit3 className="h-4 w-4" /> Edit
                                </Button>
                                <Button variant="outline" className="flex-1 group hover:border-destructive hover:text-destructive" onClick={() => deletePerson(person.id)}>
                                    <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-destructive" /> Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}