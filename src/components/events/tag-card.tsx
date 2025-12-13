import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Plus, X, Tags } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useEventEditorStore, type EventData, type tags } from "@/stores/useEventEditorStore";

// --- Mock Data (Replace with your API data) ---
const AVAILABLE_TAGS: tags[] = [
    { id: "tag-1", name: "Workshop" },
    { id: "tag-2", name: "Seminar" },
    { id: "tag-3", name: "Competition" },
    { id: "tag-4", name: "Cultural" },
    { id: "tag-5", name: "Technical" },
];

export function TagsCard({ data }: { data: EventData }) {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<tags[]>(data.tags || []);

  useEffect(() => {
    setSelectedIds(data.tags || []);
  }, [data.tags]);

  const handleSelect = (id: string) => {
    const tagToAdd = AVAILABLE_TAGS.find((tag) => tag.id === id);
    if (!tagToAdd) return;

    // already selected -> deselect it
    const isAlreadySelected = selectedIds.some((tag) => tag.id === id);
    if (isAlreadySelected) {
      const newTags = selectedIds.filter((tag) => tag.id !== id);
      setSelectedIds(newTags);

      // delete tag API CALL
      handleRemove(id);
      useEventEditorStore.getState().setEventData({ tags: newTags });
      return;
    }

    const newTags = [...selectedIds, tagToAdd];
    setSelectedIds(newTags);

    // TODO: API CALL TO ADD TAG TO EVENT
    console.log("API CALL: Add Tag", tagToAdd);

    useEventEditorStore.getState().setEventData({ tags: newTags });
  };

  const handleRemove = (id: string) => {
    const newTags = selectedIds.filter((tag) => tag.id !== id);
    setSelectedIds(newTags);

    // TODO: API CALL TO REMOVE TAG FROM EVENT
    console.log("API CALL: Remove Tag ID", id);

    useEventEditorStore.getState().setEventData({ tags: newTags });
  };

  return (
    <Card className="h-full flex flex-col border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tags className="h-5 w-5" /> Tags
        </CardTitle>
        <CardDescription>
          Select and manage the tags for this event.
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
                  <Plus className="h-4 w-4" /> Add Tags...
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-75 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search organizers..." />
              <CommandList>
                <CommandEmpty>No tag found.</CommandEmpty>
                <CommandGroup heading="Available Tags">
                  {AVAILABLE_TAGS.map((tag) => {
                    const selectedTagIds = selectedIds.map((t: tags) => t.id);
                    const isSelected = selectedTagIds.includes(tag.id);
                    return (
                        <CommandItem
                            key={tag.id}
                            value={tag.name}
                            onSelect={() => tag.id && handleSelect(tag.id)}
                        >
                            <div className="flex items-center gap-2 flex-1">
                                {/* <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-[10px]">
                                        {tag.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar> */}
                                <span>{tag.name}</span>
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
                    No tags added yet.
                </span>
            )}
            
            {selectedIds.map((tag: tags) => {
                if (!tag) return null;

                return (
                    <Badge key={tag.id} variant="secondary" className="pl-1 pr-2 py-1 gap-2 text-sm font-normal">
                        {/* <Avatar className="h-5 w-5">
                            {/* <AvatarImage src={tag.avatar} />
                            <AvatarFallback className="text-[10px]">
                                {tag.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar> */}
                        <span className="ml-2">{tag.name}</span>
                        <button 
                            onClick={() => tag.id && handleRemove(tag.id)}
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