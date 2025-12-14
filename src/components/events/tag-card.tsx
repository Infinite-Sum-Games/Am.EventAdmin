import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Plus, X, Tags as TagsIcon } from "lucide-react";
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
import { type EventData, type tags } from "@/stores/useEventEditorStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { api } from "@/lib/api";
import { eventTagsSchema, type EventTags } from "@/schemas/event";
import type { Tags } from "@/types/tags";
import { toast } from "sonner";

export function TagsCard({ data }: { data: EventData }) {

  const { data: AVAILABLE_TAGS = [], isLoading: isLoadingTags } = useQuery<Tags[]>({
  // TODO: make all query key for getting all tags consistent
  queryKey: ["all_tags"],
  queryFn: async () => {
    const response = await axiosClient.get(api.FETCH_ALL_TAGS);
    return response.data.tags;
  }
});
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<tags[]>(data.tags || []);

  useEffect(() => {
    setSelectedIds(data.tags || []);
  }, [data.tags]);

  // mutation to add tag to event
  const { mutate: addTag } = useMutation({
    mutationFn: async (payload: EventTags) => {
      // zod validation
      const validatedData = eventTagsSchema.safeParse(payload);
      if (!validatedData.success) {
        const errorMessages = validatedData.error.issues.map((issue) => issue.message).join("\n");
        throw new Error(errorMessages);
      }

      const response = await axiosClient.post(api.CONNECT_EVENT_TAG, validatedData.data);
      return response.data;
    },
    onSuccess: (_, {tag_id}) => {
      const addedTag = AVAILABLE_TAGS.find(tag => tag.id === tag_id);
      if (addedTag) {
        setSelectedIds((prev) => [...prev, addedTag]);
      }
      toast.success("Tag added to event successfully");
    },
    onError: () => {
      toast.error("Failed to add tag to event");
    }
  });

  // mutation to remove tag from event
  const { mutate: removeTag } = useMutation({
    mutationFn: async (payload: EventTags) => {
      // zod validation
      const validatedData = eventTagsSchema.safeParse(payload);
      if (!validatedData.success) {
        const errorMessages = validatedData.error.issues.map((issue) => issue.message).join("\n");
        throw new Error(errorMessages);
      }

      const response = await axiosClient.post(api.DISCONNECT_EVENT_TAG, validatedData.data);
      return response.data;
    },
    onSuccess: (_, {tag_id}) => {
      setSelectedIds((prev) => prev.filter(tag => tag.id !== tag_id));
      toast.success("Tag removed from event successfully");
    },
    onError: () => {
      toast.error("Failed to remove tag from event");
    }
  });

  const handleSelect = (id: string) => {
    // if already selected, do handle remove
    const isAlreadySelected = selectedIds.some(tag => tag.id === id);
    if (isAlreadySelected) {
      handleRemove(id);
      return;
    }
    addTag({ id: data.id, tag_id: id });
  };

  const handleRemove = (id: string) => {
    removeTag({ id: data.id, tag_id: id });
  };

  if (isLoadingTags) {
    return <div>Loading tags...</div>;
  }

  return (
    <Card className="h-full flex flex-col border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TagsIcon className="h-5 w-5" /> Tags
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
              <CommandInput placeholder="Search tags..." />
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