import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Binoculars, Trash2, Edit3, Plus } from "lucide-react";
import { queryOptions, useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { Tags } from "@/types/tags";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewTagForm } from "@/components/tags/new-tag-form";
import { Card } from "@/components/ui/card";
import { EditTagForm } from "@/components/tags/edit-tag-form";
import { axiosClient } from "@/lib/axios";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// --- Data Fetching ---
const tagsQueryOptions = queryOptions({
  queryKey: ["tags"],
  queryFn: async () => {
    const response = await axiosClient.get(api.FETCH_ALL_TAGS);
    return response.data.tags as Tags[];
  },
});

export const Route = createFileRoute("/dashboard/tags/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(tagsQueryOptions),
  component: TagsPage,
});

function TagsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const { data: tags } = useSuspenseQuery(tagsQueryOptions);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [tagToEdit, setTagToEdit] = useState<Tags | null>(null);
  const [tagToDeleteId, setTagToDeleteId] = useState<string | null>(null);

  const filteredTags = tags == null ? [] : tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { mutate: deleteTagMutation } = useMutation({
    mutationFn: async (tagId: string) => {
      await axiosClient.delete(api.DELETE_TAG(tagId));
    },
    onSuccess: () => {
      toast.success("Tag deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: () => {
      toast.error("Failed to delete tag. This tag may be connected to existing existing events");
    }
  });

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground">
            Manage tags used to categorize your data.
          </p>
        </div>

        <div className="flex items-center">
          <Input type="text" placeholder="Search tags..." className="mr-4" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          {/* Create Tag Button */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center cursor-pointer">
                <Plus className="h-4 w-4" />Create New Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Tag</DialogTitle>
              </DialogHeader>
              <NewTagForm onSuccess={() => {
                toast.success("Tag created successfully");
                setIsCreateDialogOpen(false);
                queryClient.invalidateQueries({ queryKey: ['tags'] });
              }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {(!filteredTags || filteredTags.length === 0) ? (
        <div className="flex flex-col items-center justify-center bg-muted/30 border border-muted rounded-lg py-12 mt-4">
          <div className="bg-background p-4 rounded-full mb-4">
            <Binoculars className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No tags found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4 text-center max-w-sm">
            You haven't created any tags yet. Click the button above to get started.
          </p>
        </div>
      ) : (
        // Grid Layout for Horizontal Cards
        <div className="grid grid-cols-2 gap-4">
          {filteredTags.map((tag) => (
            <Card
              key={tag.id}
              className="flex flex-row items-center justify-between p-4 transition-colors hover:bg-muted/40 hover:shadow-sm gap-0"
            >

              <div className="flex flex-row w-full justify-between items-center ">
                {/* Icon & Info */}
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm  truncate">
                      {tag.abbreviation.toUpperCase()}
                    </span>
                    <span className="truncate font-medium text-lg text-foreground" title={tag.name}>
                      {tag.name}
                    </span>
                  </div>
                </div>

                <TooltipProvider>
                  <Tooltip >
                    <TooltipTrigger asChild className="bg-accent/90">
                      <div className="text-lg w-10 h-10 items-center flex justify-center text-foreground font-semibold bg-accent/70 px-3 py-1 rounded-md">
                        {tag.events.length}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-accent/90 text-foreground">
                      <p>No of events associated with this tag</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Separator orientation="vertical" className="h-8 mx-4" />

              {/* Right Side: Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  onClick={() => setTagToEdit(tag)}
                  title="Edit Tag"
                  className="flex items-center cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setTagToDeleteId(tag.id)}
                  title="Delete Tag"
                  className="flex items-center cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
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
          <div className="flex justify-end gap-2 mt-4">
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