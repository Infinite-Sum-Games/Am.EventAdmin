import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventCard } from "@/components/events/event-card";
import { Binoculars, Loader2, Plus, Search } from "lucide-react";
import { api } from "@/lib/api";
import { axiosClient } from "@/lib/axios";
import { toast } from "sonner";
import type { EventData } from "@/stores/useEventEditorStore";
import { BaseSkeleton } from "@/components/Skeleton/base-skeleton";
import { cardGridSkeletonLayout} from "@/components/Skeleton/layouts";

export const Route = createFileRoute("/dashboard/events/")({
  component: ViewEventsPage,
});

function ViewEventsPage() {
  const { data: events = [], isLoading } = useQuery<EventData[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await axiosClient.get(api.FETCH_ALL_EVENTS);
      return response.data.events;
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // sort events by updated_at descending
  const sortedEvents = (events || []).slice().sort((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });


  // search filtering
  const filteredEvents = sortedEvents.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // mutation to create a new event
  const { mutate: handleCreateEvent, isPending: isCreating } = useMutation({
    mutationFn: async () => {
      const response = await axiosClient.get(api.CREATE_EVENT);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['event', data.id], data);
      navigate({ to: `/dashboard/events/${data.id}` })
    },
    onError: () => {
      toast.error("Failed to initialize event");
    },
  });
    if (isLoading)  return <BaseSkeleton layout={cardGridSkeletonLayout} />;

  return (
    <div className="flex flex-col gap-4 p-4 max-w-7xl mx-auto">
      <div className="flex flex-row gap-4 items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">View All Events</h1>
          <p className="text-muted-foreground">Manage your events effectively.</p>
        </div>
        <div className="flex flex-row items-center justify-between">
          {/* Search Bar */}
          <div className="relative mr-4">
            <Input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>

          {/* Create Event Button */}
          <Button
            className="flex items-center gap-2"
            onClick={() => handleCreateEvent()}
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create New Event
              </>
            )}
          </Button>
        </div>
      </div>

        {filteredEvents && filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col w-full items-center justify-center bg-muted/30 border border-muted rounded-lg py-12 mt-4">
            <div className="bg-background p-4 rounded-full mb-4">
              <Binoculars className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No events found</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4 text-center max-w-sm">
              You haven't created any events yet. Click the button above to get started.
            </p>
          </div>
        )}
    </div>
  );
}