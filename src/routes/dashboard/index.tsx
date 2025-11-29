import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Binoculars, PlusCircle } from "lucide-react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { EventCard } from "@/components/events/event-card";
import type { Event } from "@/types/events";

// --- Dummy Data ---
const dummyEvents: Event[] = [
  {
    "event_id": "event-1",
    "event_image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "event_name": "Hackathon",
    "event_status": "ACTIVE",
    "event_description": "A 24-hour coding marathon where innovators and developers come together to solve real-world problems and build amazing projects from scratch.",
    "event_date": "2025-02-10",
    "is_group": true,
    "tags": ["Technology", "Coding", "Competition"],
    "event_price": 500,
    "is_registered": false,
    "is_starred": false,
    "max_seats": 200,
    "seats_filled": 120
  },
  {
    "event_id": "event-2",
    "event_image_url": "https://images.unsplash.com/photo-1535223289827-42f1e99197ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "event_name": "Robotics Workshop",
    "event_status": "ACTIVE",
    "event_description": "An immersive, hands-on workshop covering the fundamentals of robotics, from building simple circuits to programming autonomous robots.",
    "event_date": "2025-02-12",
    "is_group": false,
    "tags": ["Robotics", "Workshop", "STEM"],
    "event_price": 300,
    "is_registered": false,
    "is_starred": false,
    "max_seats": 100,
    "seats_filled": 80
  }
];

// Define a query for fetching events
const eventsQueryOptions = queryOptions({
  queryKey: ["events"],
  queryFn: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return dummyEvents;
  },
});

export const Route = createFileRoute("/dashboard/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(eventsQueryOptions),
  component: DashboardIndex,
});

function DashboardIndex() {
  const { data: events } = useSuspenseQuery(eventsQueryOptions);

  return (
    <div className="flex flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events</h1>
        <Button asChild>
          <Link to="/dashboard/events/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Event
          </Link>
        </Button>
      </div>
      
      {(!events || events.length === 0) ? (
        <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md shadow-sm py-8 mt-4">
          <Binoculars className="w-24 h-24 my-2 text-muted-foreground" />
          <p className="text-lg font-semibold text-foreground mt-4">
            No events found
          </p>
          <p className="text-sm text-muted-foreground">
            Click "Create New Event" to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event: Event) => (
            <EventCard key={event.event_id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
