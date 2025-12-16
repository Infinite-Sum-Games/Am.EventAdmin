import { createFileRoute } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Binoculars, Trash2, Edit3, Mail, Phone, Search, Briefcase, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { NewPersonForm } from "@/components/people/new-person-form";
import { EditPersonForm } from "@/components/people/edit-person-form";
import { axiosClient } from '@/lib/axios';
import { api } from '@/lib/api';
import type { People } from '@/types/people';
import { toast } from 'sonner';
import { Separator } from "@/components/ui/separator";

// --- Data Fetching ---
const peopleQueryOptions = queryOptions({
    queryKey: ['people'],
    queryFn: async () => {
        const response = axiosClient.get(api.FETCH_ALL_PEOPLE);
        const res = await response;
        return res.data.people ?? [];
    }
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
    const [editingPerson, setEditingPerson] = useState<People | null>(null);
    const [personToDelete, setPersonToDelete] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPeople = useMemo(() => {
        if (!searchTerm) {
            return people;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return people.filter((person: any) =>
            person.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            (person.email && person.email.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (person.profession && person.profession.toLowerCase().includes(lowerCaseSearchTerm))
        );
    }, [people, searchTerm]);

    const { mutate: deletePerson, isPending: isDeleting } = useMutation({
        mutationFn: async (id: string) => {
            await axiosClient.delete(`${api.DELETE_PEOPLE(id)}`);
        },
        onSuccess: () => {
            toast.success("Person deleted successfully.");
            setPersonToDelete(null);
            queryClient.invalidateQueries({ queryKey: ['people'] });
        },
        onError: () => {
            toast.error("Failed to delete person. This person may be linked to existing events.");
            setPersonToDelete(null);
        }
    });

    return (
        <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex gap-4 flex-row justify-between items-center border-b pb-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Dignitaries</h1>
                    <p className="text-muted-foreground">Manage your dignitaries and contacts.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search dignitaries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-background"
                        />
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-auto shadow-sm cursor-pointer">
                                <Plus className="h-4 w-4" />Add Dignitary
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a New Dignitary</DialogTitle>
                            </DialogHeader>
                            <NewPersonForm onSuccess={() => {
                                toast.success("Person created successfully.");
                                setIsDialogOpen(false);
                                queryClient.invalidateQueries({ queryKey: ['people'] });
                            }} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Content Section */}
            {(!filteredPeople || filteredPeople.length === 0) ? (
                <div className="flex flex-col items-center justify-center bg-muted/30 border border-muted rounded-lg py-12 mt-4">
                    <div className="bg-background p-4 rounded-full mb-4">
                        <Binoculars className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">No dignitaries found</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4 text-center max-w-sm">
                        You haven't created any dignitaries yet. Click the button above to get started.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-4">
                    {filteredPeople.map((person: any) => (
                        <Card key={person.id} className="group overflow-hidden transition-all hover:shadow-md flex flex-col p-0">
                            <CardContent className="p-6 flex flex-col gap-4 items-start">
                                {/* Header: Avatar & Name */}
                                <div className="h-full flex items-center gap-4 justify-center align-middle">
                                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                            {getInitials(person.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col overflow-hidden">
                                        <h2 className="text-lg font-semibold truncate leading-tight" title={person.name}>
                                            {person.name}
                                        </h2>
                                        {person.profession && (
                                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                                                <Briefcase className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate">{person.profession}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Contact Details */}
                                <div className="flex flex-col gap-2.5 text-sm">
                                    <a
                                        href={`mailto:${person.email}`}
                                        className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group/link p-1.5 rounded-md hover:bg-muted/50 -ml-1.5"
                                        title={person.email}
                                    >
                                        <div className="bg-primary/5 p-1.5 rounded-md group-hover/link:bg-primary/10 transition-colors">
                                            <Mail className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="truncate">{person.email}</span>
                                    </a>

                                    {person.phone_number && (
                                        <a
                                            href={`tel:${person.phone_number}`}
                                            className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group/link p-1.5 rounded-md hover:bg-muted/50 -ml-1.5"
                                        >
                                            <div className="bg-primary/5 p-1.5 rounded-md group-hover/link:bg-primary/10 transition-colors">
                                                <Phone className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="truncate">{person.phone_number}</span>
                                        </a>
                                    )}
                                </div>
                            </CardContent>

                            {/* Actions Footer */}
                            <CardFooter className="p-0 border-t bg-muted/5 m-0 [.border-t]:pt-0">
                                <div className="flex w-full divide-x border-t-0 p-0 m-0">
                                    <Button
                                        variant="default"
                                        className="flex-1 h-12 rounded-none cursor-pointer"
                                        onClick={() => setEditingPerson(person)}
                                    >
                                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="flex-1 h-12 rounded-none cursor-pointer"
                                        onClick={() => setPersonToDelete(person.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={!!editingPerson} onOpenChange={(open) => !open && setEditingPerson(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Dignitary</DialogTitle>
                    </DialogHeader>
                    {editingPerson && (
                        <EditPersonForm
                            personId={editingPerson.id}
                            initialData={editingPerson}
                            onSuccess={() => {
                                toast.success("Person updated successfully.");
                                setEditingPerson(null);
                                queryClient.invalidateQueries({ queryKey: ['people'] });
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Alert Dialog */}
            <AlertDialog open={!!personToDelete} onOpenChange={(open) => !open && setPersonToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Dignitary?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this dignitary? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                if (personToDelete) deletePerson(personToDelete);
                            }}
                            className="bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 cursor-pointer"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete Person"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}