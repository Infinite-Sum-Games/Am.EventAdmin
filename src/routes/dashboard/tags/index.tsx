import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Binoculars, PlusCircle, Trash2, Edit3 } from "lucide-react";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import type { Tag } from "@/types/db";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewTagForm } from "@/components/tags/new-tag-form";
import { Card } from "@/components/ui/card";

// --- Dummy Data ---
const dummyTags: Tag[] = [
  { id: "uuid-1", name: "Technology", abbreviation: "TECH" },
  { id: "uuid-2", name: "Workshop", abbreviation: "WRK" },
  { id: "uuid-3", name: "Competition", abbreviation: "COMP" },
  { id: "uuid-4", name: "Arts", abbreviation: "ARTS" },
  { id: "uuid-5", name: "Management", abbreviation: "MGMT" },
  { id: "uuid-6", name: "Sports", abbreviation: "SPT" },
  { id: "uuid-7", name: "Gaming", abbreviation: "GAME" },
  { id: "uuid-8", name: "Literature", abbreviation: "LIT" },
];

// --- Data Fetching ---
const tagsQueryOptions = queryOptions({
  queryKey: ["tags"],
  queryFn: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return dummyTags;
  },
});

export const Route = createFileRoute("/dashboard/tags/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(tagsQueryOptions),
  component: TagsPage,
});

function TagsPage() {
  const queryClient = useQueryClient();
  const { data: tags } = useSuspenseQuery(tagsQueryOptions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const deleteTag = (tagId: string) => {
    alert(`(Simulated) Deleting tag with ID: ${tagId}`);
    // queryClient.invalidateQueries({ queryKey: ['tags'] });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tags</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Tag</DialogTitle>
            </DialogHeader>
            <NewTagForm onSuccess={() => {
              setIsDialogOpen(false);
              queryClient.invalidateQueries({ queryKey: ['tags'] });
              alert("New tag would be added to the list on refetch.");
            }} />
          </DialogContent>
        </Dialog>
      </div>

      {(!tags || tags.length === 0) ? (
        <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md shadow-xs py-8 mt-4">
          <Binoculars className="w-24 h-24 my-2 text-muted-foreground" />
          <p className="text-lg font-semibold text-foreground mt-4">No tags found</p>
          <p className="text-sm text-muted-foreground">Click "Create New Tag" to get started.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {tags.map((tag) => (
            <Card key={tag.id} className="group relative p-4 w-40 h-40 flex flex-col justify-center items-center text-center transition-all hover:bg-secondary">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
                        <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteTag(tag.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                </div>

                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full font-bold text-lg mb-2">
                  {tag.abbreviation}
                </div>
                <h2 className="text-md font-semibold text-foreground truncate w-full">
                  {tag.name}
                </h2>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}