import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Plus, X, Users } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { type EventData, type organizers } from "@/stores/useEventEditorStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { api } from "@/lib/api";
import type { Organizer } from "@/types/organizers";
import { eventOrganizersSchema, type EventOrganizers } from "@/schemas/event";
import { toast } from "sonner";

export function OrganizersCard({ data }: { data: EventData }) {
  // fetch all organizers from the API
  // TODO: match query tags with existing tags in ORGANIZERS page
  const { data: AVAILABLE_ORGANIZERS = [], isLoading } = useQuery<Organizer[]>({
    queryKey: ["all_organizers"],
    queryFn: async () => {
      const response = await axiosClient.get(api.FETCH_ALL_ORGANIZERS);
      return response.data.organizers;
    },
  });

  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const selectedOrganizers = data.organizers ?? [];

  // mutation to add organizer to event
  const { mutate: addOrganizer } = useMutation({
    mutationFn: async (payload: EventOrganizers) => {
      // zod validation
      const validatedData = eventOrganizersSchema.safeParse(payload);
      if (!validatedData.success) {
        const errorMessages = validatedData.error.issues.map(err => err.message).join("\n");
        throw new Error(errorMessages);
      }

      const response = await axiosClient.post(api.CONNECT_EVENT_ORGANIZER, validatedData.data);
      return response.data;
    },
    onSuccess: (_, { organizer_id }) => {
      queryClient.setQueryData(['event', data.id], (oldData: EventData | undefined) => {
        if (!oldData) return oldData;
        const addedOrganizer = AVAILABLE_ORGANIZERS.find(org => org.id === organizer_id);
        // this is a crappy way to do it, but works for now
        const updatedOrganizers = addedOrganizer ? [...(oldData.organizers || []), addedOrganizer] : (oldData.organizers || []);
        return { ...oldData, organizers: updatedOrganizers };
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });

      toast.success("Organizer added successfully");
    },
    onError: () => {
      toast.error("Failed to add organizer");
    },
  });

  // mutation to remove organizer from event
  const { mutate: removeOrganizer } = useMutation({
    mutationFn: async (payload: EventOrganizers) => {
      // zod validation
      const validatedData = eventOrganizersSchema.safeParse(payload);
      if (!validatedData.success) {
        const errorMessages = validatedData.error.issues.map(err => err.message).join("\n");
        throw new Error(errorMessages);
      }

      const response = await axiosClient.post(api.DISCONNECT_EVENT_ORGANIZER, validatedData.data);
      return response.data;
    },
    onSuccess: (_, { organizer_id }) => {
      queryClient.setQueryData(['event', data.id], (oldData: EventData | undefined) => {
        if (!oldData) return oldData;
        const updatedOrganizers = (oldData.organizers || []).filter(org => org.id !== organizer_id);
        return { ...oldData, organizers: updatedOrganizers };
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success("Organizer removed successfully");
    },
    onError: () => {
      toast.error("Failed to remove organizer");
    },
  });


  const handleSelect = (id: string) => {
    // if already selected, do handle remove
    const isAlreadySelected = selectedOrganizers.some(org => org.id === id);
    if (isAlreadySelected) {
      handleRemove(id);
      return;
    }
    addOrganizer({ id: data.id, organizer_id: id });
  };

  const handleRemove = (id: string) => {
    removeOrganizer({ id: data.id, organizer_id: id });
  };

  if (isLoading) {
    return <div>Loading organizers...</div>;
  }

  return (
    <Card className="h-full flex flex-col border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" /> Organizers
        </CardTitle>
        <CardDescription>
          Select and manage the organizers for this event.
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
                  <Plus className="h-4 w-4" /> Add Organizer...
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-75 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search organizers..." />
              <CommandList>
                <CommandEmpty>No organizer found.</CommandEmpty>
                <CommandGroup heading="Available Organizers">
                  {AVAILABLE_ORGANIZERS.map((org) => {
                    const selectedOrgIds = selectedOrganizers.map((o: organizers) => o.id);
                    const isSelected = selectedOrgIds.includes(org.id);
                    return (
                        <CommandItem
                            key={org.id}
                            value={org.name}
                            onSelect={() => org.id && handleSelect(org.id)}
                        >
                            <div className="flex items-center gap-2 flex-1">
                                <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-[10px]">
                                        {org.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span>{org.name}</span>
                            </div>
                            {isSelected && <Check className="ml-auto h-4 w-4" />}
                        </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        <div className="flex flex-wrap gap-2 min-h-10 items-center">
            {selectedOrganizers.length === 0 && (
                <span className="text-sm text-muted-foreground italic">
                    No organizers added yet.
                </span>
            )}
            
            {selectedOrganizers.map((org: organizers) => {
                if (!org) return null;
                
                return (
                    <Badge key={org.id} variant="secondary" className="pl-1 pr-2 py-1 gap-2 text-sm font-normal">
                        <Avatar className="h-5 w-5">
                            {/* <AvatarImage src={org.avatar} /> */}
                            <AvatarFallback className="text-[10px]">
                                {org.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {org.name}
                        <button 
                            onClick={() => org.id && handleRemove(org.id)}
                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-muted-foreground/20 p-0.5 transition-colors"
                        >
                            <X className="h-3 w-3 text-muted-foreground" />
                        </button>
                    </Badge>
                )
            })}
        </div>

      </CardContent>
    </Card>
  );
}