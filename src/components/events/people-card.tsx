import { useState } from "react";
import { ChevronsUpDown, Plus, Trash2, Users, X } from "lucide-react"; // Added Trash2
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Added Table imports
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { type EventData, type people } from "@/stores/useEventEditorStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { People } from "@/types/people";
import { axiosClient } from "@/lib/axios";
import { api } from "@/lib/api";
import { eventPeopleSchema, type EventPeople } from "@/schemas/event";
import { toast } from "sonner";

export function PeopleCard({ data }: { data: EventData }) {

  const { data: AVAILABLE_PEOPLE = [], isLoading } = useQuery<People[]>({
    queryKey: ["all-people"],
    queryFn: async () => {
      const response = await axiosClient.get(api.FETCH_ALL_PEOPLE);
      return response.data.people;
    }
  });

  const [open, setOpen] = useState(false);
  const selectedPeople = data.people || [];
  const queryClient = useQueryClient();

  // mutation to add person to event
  const { mutate: addPeople } = useMutation({
    mutationFn: async (payload: EventPeople) => {
      // zod validation
      const validatedData = eventPeopleSchema.safeParse(payload);
      if (!validatedData.success) {
        const errorMessages = validatedData.error.issues.map(issue => issue.message).join("\n");
        throw new Error(errorMessages);
      }

      const response = await axiosClient.post(api.CONNECT_EVENT_PEOPLE, validatedData.data);
      return response.data;
    },
    onSuccess: (_, { person_id }) => {
      queryClient.setQueryData(["event", data.id], (oldData: EventData | undefined) => {
        if (!oldData) return oldData;
        const addedPeople = AVAILABLE_PEOPLE.find(p => p.id === person_id);
        const updatedPeople = addedPeople ? [...(oldData.people || []), addedPeople] : oldData.people || [];
        return { ...oldData, people: updatedPeople };
      });

      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Dignitary added to event successfully");
    },
    onError: () => {
      toast.error("Failed to add dignitary to event");
    }
  })

  // mutation to remove person from event
  const { mutate: removePeople } = useMutation({
    mutationFn: async (payload: EventPeople) => {
      // zod validation
      const validatedData = eventPeopleSchema.safeParse(payload);
      if (!validatedData.success) {
        const errorMessages = validatedData.error.issues.map(issue => issue.message).join("\n");
        throw new Error(errorMessages);
      }

      const response = await axiosClient.delete(api.DISCONNECT_EVENT_PEOPLE, { data: validatedData.data });
      return response.data;
    },
    onSuccess: (_, { person_id }) => {
      queryClient.setQueryData(["event", data.id], (oldData: EventData | undefined) => {
        if (!oldData) return oldData;
        const updatedPeople = (oldData.people || []).filter(p => p.id !== person_id);
        return { ...oldData, people: updatedPeople };
      });

      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Dignitary removed from event successfully");
    },
    onError: () => {
      toast.error("Failed to remove dignitary from event");
    }
  })


  const handleSelect = (id: string) => {
    addPeople({ person_id: id, id: data.id });
  }

  const handleRemove = (id: string) => {
    removePeople({ person_id: id, id: data.id });
  }

  if (isLoading) {
    return <div>Loading People...</div>
  }

  return (
    <Card className="h-full flex flex-col border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" /> Dignitaries
        </CardTitle>
        <CardDescription>
          Select and manage the dignitaries for this event.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <Plus className="h-4 w-4" /> Add Dignitary...
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-75 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search dignitary..." />
              <CommandList>
                <CommandEmpty>No dignitary found.</CommandEmpty>
                <CommandGroup heading="Available Dignitaries">
                  {AVAILABLE_PEOPLE?.map((person) => {
                    const selectedPersonIds = selectedPeople.map((o: people) => o.id);
                    const isSelected = selectedPersonIds.includes(person.id);
                    return (
                      <CommandItem
                        key={person.id}
                        value={person.name}
                        onSelect={() => {
                          if (!person.id) return;
                          if (isSelected) {
                            handleRemove(person.id);
                          } else {
                            handleSelect(person.id);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px]">
                              {person.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{person.name}</span>
                        </div>
                        {isSelected && <X className="ml-auto h-4 w-4" />}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Table View for Added People */}
        <div className="rounded-md border">
          <Table className="h-full overflow-y-scroll">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Profession</TableHead>
                <TableHead className="flex justify-end items-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedPeople.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground italic">
                    
                    No dignitaries added yet.
                  </TableCell>
                </TableRow>
              ) : (
                selectedPeople.map((person: people) => {
                  if (!person) return null;
                  return (
                    <TableRow key={person.id} className="overflow-y-scroll">
                      <TableCell className="flex items-center gap-3 font-medium">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {person.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {person.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {person.profession}
                      </TableCell>
                      <TableCell className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => person.id && handleRemove(person.id)}
                          className="h-8 w-8 border border-destructive text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

      </CardContent>
    </Card>
  );
}