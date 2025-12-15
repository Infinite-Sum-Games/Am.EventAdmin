import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventCard } from "@/components/events/event-card";
import { Loader2, Plus, Search } from "lucide-react";
import { api } from "@/lib/api";
import { axiosClient } from "@/lib/axios";
import { toast } from "sonner";
import type { EventData } from "@/stores/useEventEditorStore";

export const Route = createFileRoute("/dashboard/events/")({
  component: ViewEventsPage,
});

function ViewEventsPage() {
  const { data: events = [] } = useQuery<EventData[]>( {
    queryKey: ['events'],
    queryFn: async () => {
      const response = await axiosClient.get(api.FETCH_ALL_EVENTS);
      console.log("Fetched Events:", response);
      return response.data.events;
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // sort events by updated_at descending
  const sortedEvents = events.sort((a, b) => {
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
      console.log("Create Event Response:", response.data);
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents && filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No events found
          </div>
        )}
      </div>
    </div>
  );
}