import { createFileRoute } from '@tanstack/react-router';
import { queryOptions, useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Binoculars, PlusCircle, Trash2, Edit3, Mail, Phone } from "lucide-react";
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
import type { PeopleData } from '@/types/people';
import { toast } from 'sonner';

// --- Data Fetching ---
const peopleQueryOptions = queryOptions({
    queryKey: ['people'],
    queryFn: async () => {
        const response = axiosClient.get(api.GET_ALL_PEOPLE);
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
    const [editingPerson, setEditingPerson] = useState<PeopleData | null>(null);
    
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
            toast.error("Failed to delete person. Please try again.");
            setPersonToDelete(null);
        }
    });

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

                    {/* Create Person Button */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto"><PlusCircle className="h-4 w-4" /> Add New Person</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a New Person</DialogTitle>
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

            {/* Edit Dialog */}
            <Dialog open={!!editingPerson} onOpenChange={(open) => !open && setEditingPerson(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Person</DialogTitle>
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
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the person from the database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => {
                                e.preventDefault();
                                if (personToDelete) deletePerson(personToDelete);
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {(!filteredPeople || filteredPeople.length === 0) ? (
                <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md shadow-xs py-8 mt-4">
                    <Binoculars className="w-24 h-24 my-2 text-muted-foreground" />
                    <p className="text-lg font-semibold mt-4">No people found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPeople.map((person: any) => (
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
                                <Button 
                                    variant="outline" 
                                    className="flex-1" 
                                    onClick={() => setEditingPerson(person)}
                                >
                                    <Edit3 className="h-4 w-4" /> Edit
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    className="flex-1 group" 
                                    onClick={() => setPersonToDelete(person.id)}
                                >
                                    <Trash2 className="h-4 w-4" /> Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}