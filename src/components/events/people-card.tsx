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
import { useEventEditorStore, type EventData, type organizers, type people } from "@/stores/useEventEditorStore";

// --- Mock Data (Replace with your API data) ---
const AVAILABLE_PEOPLE: people[] = [
    { id: "p1", name: "Alice Johnson" },
    { id: "p2", name: "Bob Smith" },
    { id: "p3", name: "Charlie Brown" },
    { id: "p4", name: "Diana Prince" },
    { id: "p5", name: "Edward Elric" },
];

export function PeopleCard({ data }: { data: EventData }) {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<people[]>(data.people || []);

  useEffect(() => {
    setSelectedIds(data.people || []);
  }, [data.people]);

  const handleSelect = (id: string) => {
    const personToAdd = AVAILABLE_PEOPLE.find((person) => person.id === id);
    if (!personToAdd) return;

    // already selected -> deselect it
    const isAlreadySelected = selectedIds.some((person) => person.id === id);
    if (isAlreadySelected) {
      const newPeople = selectedIds.filter((person) => person.id !== id);
      setSelectedIds(newPeople);
      useEventEditorStore.getState().setEventData({ people: newPeople });
      return;
    }

    const newPeople = [...selectedIds, personToAdd];
    setSelectedIds(newPeople);

    // TODO: API CALL TO ADD PERSON TO EVENT
    console.log("API CALL: Add Person", personToAdd);

    useEventEditorStore.getState().setEventData({ people: newPeople });
  };

  const handleRemove = (id: string) => {
    const newPeople = selectedIds.filter((person) => person.id !== id);
    setSelectedIds(newPeople);

    // TODO: API CALL TO REMOVE PERSON FROM EVENT
    console.log("API CALL: Remove Person ID", id);

    useEventEditorStore.getState().setEventData({ people: newPeople });
  };

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
                  {AVAILABLE_PEOPLE.map((person) => {
                    const selectedPersonIds = selectedIds.map((o: people) => o.id);
                    const isSelected = selectedPersonIds.includes(person.id);
                    return (
                        <CommandItem
                            key={person.id}
                            value={person.name}
                            onSelect={() => person.id && handleSelect(person.id)}
                        >
                            <div className="flex items-center gap-2 flex-1">
                                <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-[10px]">
                                        {person.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span>{person.name}</span>
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
                    No dignitaries added yet.
                </span>
            )}

            {selectedIds.map((person: people) => {
                if (!person) return null;
                
                return (
                    <Badge key={person.id} variant="secondary" className="pl-1 pr-2 py-1 gap-2 text-sm font-normal">
                        <Avatar className="h-5 w-5">
                            {/* <AvatarImage src={person.avatar} /> */}
                            <AvatarFallback className="text-[10px]">
                                {person.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {person.name}
                        <button 
                            onClick={() => person.id && handleRemove(person.id)}
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