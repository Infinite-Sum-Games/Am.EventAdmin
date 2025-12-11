import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Binoculars, PlusCircle, Trash2, Edit3 } from "lucide-react";
import { queryOptions, useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { Tag } from "@/types/db";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewTagForm } from "@/components/tags/new-tag-form";
import { Card } from "@/components/ui/card";
import { EditTagForm } from "@/components/tags/edit-tag-form";
import { axiosClient } from "@/lib/axios";
import { api } from "@/lib/api";  
import { toast } from "sonner";

// --- Data Fetching ---
const tagsQueryOptions = queryOptions({
  queryKey: ["tags"],
  queryFn: async () => {
    const response = await axiosClient.get(api.FETCH_ALL_TAGS);
    return response.data.tags as Tag[]; 
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
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [tagToEdit, setTagToEdit] = useState<Tag | null>(null);
  const [tagToDeleteId, setTagToDeleteId] = useState<string | null>(null);

  const { mutate: deleteTagMutation } = useMutation({
    mutationFn: async (tagId: string) => {
      await axiosClient.delete(api.DELETE_TAG(tagId));
    },
    onSuccess: () => {
      toast.success("Tag deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: () => {
      toast.error("Failed to delete tag. Please try again.");
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tags</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
              setIsCreateDialogOpen(false);
              queryClient.invalidateQueries({ queryKey: ['tags'] });
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
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setTagToEdit(tag)}>
            <Edit3 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {setTagToDeleteId(tag.id)}}>
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

    {/* Edit Tag Dialog */}
      <Dialog open={!!tagToEdit} onOpenChange={(open) => !open && setTagToEdit(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Tag</DialogTitle>
        </DialogHeader>
        {tagToEdit && (
          <EditTagForm 
            tag={tagToEdit} 
            onSuccess={() => {
              setTagToEdit(null);
              toast.success("Tag updated successfully");
              queryClient.invalidateQueries({ queryKey: ['tags'] });
            }} 
          />
        )}
      </DialogContent>
    </Dialog>

    {/* Delete Confirmation Dialog */}
    <Dialog open={!!tagToDeleteId} onOpenChange={(open) => !open && setTagToDeleteId(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Tag</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this tag? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setTagToDeleteId(null)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              if (tagToDeleteId) {
                deleteTagMutation(tagToDeleteId);
                setTagToDeleteId(null);
              }
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  );
}