import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Binoculars, PlusCircle, Trash2, Edit3 } from "lucide-react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { Tag } from "@/types/db";
import { Card, CardContent } from "@/components/ui/card";

// --- Dummy Data ---
const dummyTags: Tag[] = [
  { id: "uuid-1", name: "Technology", abbreviation: "TECH" },
  { id: "uuid-2", name: "Workshop", abbreviation: "WRK" },
  { id: "uuid-3", name: "Competition", abbreviation: "COMP" },
  { id: "uuid-4", name: "Arts", abbreviation: "ARTS" },
  { id: "uuid-5", name: "Management", abbreviation: "MGMT" },
  { id: "uuid-6", name: "Sports", abbreviation: "SPT" },
];

// --- Data Fetching ---
const tagsQueryOptions = queryOptions({
  queryKey: ["tags"],
  queryFn: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return dummyTags;
    // Real fetch would be:
    // const res = await fetch(api.TAGS_URL);
    // if (!res.ok) throw new Error("Failed to fetch tags");
    // return (await res.json()).DATA;
  },
});

export const Route = createFileRoute("/dashboard/tags/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(tagsQueryOptions),
  component: TagsPage,
});

function TagsPage() {
  const { data: tags } = useSuspenseQuery(tagsQueryOptions);

  const deleteTag = (tagId: string) => {
    alert(`(Simulated) Deleting tag with ID: ${tagId}`);
    // In a real app, you would call the delete API and invalidate the query
  };

  return (
    <div className="flex flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tags</h1>
        <Button asChild>
          <Link to="/dashboard/tags/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Tag
          </Link>
        </Button>
      </div>

      {(!tags || tags.length === 0) ? (
        <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md shadow-sm py-8 mt-4">
          <Binoculars className="w-24 h-24 my-2 text-muted-foreground" />
          <p className="text-lg font-semibold text-foreground mt-4">
            No tags found
          </p>
          <p className="text-sm text-muted-foreground">
            Click "Create New Tag" to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <Card key={tag.id} className="flex flex-col p-4 justify-between items-center text-center">
              <CardContent className="flex flex-col items-center p-0">
                <div className="flex items-center justify-center w-20 h-20 bg-primary text-primary-foreground rounded-full border-2 border-background font-bold text-xl mb-2">
                  {tag.abbreviation}
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {tag.name}
                </h2>
              </CardContent>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="icon" disabled>
                    <Edit3 className="w-5 h-5" />
                    <span className="sr-only">Edit Tag</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => deleteTag(tag.id)}
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                  <span className="sr-only">Delete Tag</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}