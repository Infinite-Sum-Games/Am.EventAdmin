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
import { useEventEditorStore, type EventData, type organizers } from "@/stores/useEventEditorStore";

// --- Mock Data (Replace with your API data) ---
const AVAILABLE_ORGANIZERS: organizers[] = [
  { id: "org-1", name: "Coding Club" },
  { id: "org-2", name: "Student Council" },
  { id: "org-3", name: "Robotics Society" },
  { id: "org-4", name: "Design Team" },
  { id: "org-5", name: "Debate Club" },
];

export function OrganizersCard({ data }: { data: EventData }) {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<organizers[]>(data.organizers || []);

  useEffect(() => {
    setSelectedIds(data.organizers || []);
  }, [data.organizers]);

  const handleSelect = (id: string) => {
    const organizerToAdd = AVAILABLE_ORGANIZERS.find((org) => org.id === id);
    if (!organizerToAdd) return;

    // already selected -> deselect it
    const isAlreadySelected = selectedIds.some((org) => org.id === id);
    if (isAlreadySelected) {
      const newOrganizers = selectedIds.filter((org) => org.id !== id);
      setSelectedIds(newOrganizers);
      useEventEditorStore.getState().setEventData({ organizers: newOrganizers });
      return;
    }

    const newOrganizers = [...selectedIds, organizerToAdd];
    setSelectedIds(newOrganizers);

    // TODO: API CALL TO ADD ORGANIZER TO EVENT
    console.log("API CALL: Add Organizer", organizerToAdd);

    useEventEditorStore.getState().setEventData({ organizers: newOrganizers });
  };

  const handleRemove = (id: string) => {
    const newOrganizers = selectedIds.filter((org) => org.id !== id);
    setSelectedIds(newOrganizers);

    // TODO: API CALL TO REMOVE ORGANIZER FROM EVENT
    console.log("API CALL: Remove Organizer ID", id);

    useEventEditorStore.getState().setEventData({ organizers: newOrganizers });
  };

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
                    const selectedOrgIds = selectedIds.map((o: organizers) => o.id);
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
            {selectedIds.length === 0 && (
                <span className="text-sm text-muted-foreground italic">
                    No organizers added yet.
                </span>
            )}
            
            {selectedIds.map((org: organizers) => {
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