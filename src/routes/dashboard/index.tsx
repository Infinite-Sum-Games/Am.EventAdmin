import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Binoculars, Edit3, Notebook, PlusCircle } from "lucide-react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

// --- Dummy Data ---
const dummyEvents = [
  {
    "event_id": "event-1",
    "event_image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "event_name": "Hackathon",
    "event_status": "ACTIVE",
    "event_description": "24-hour hackathon",
    "event_date": "2025-02-10",
    "is_group": true,
    "tags": ["Technology", "Coding"],
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
    "event_description": "Advanced robotics",
    "event_date": "2025-02-12",
    "is_group": false,
    "tags": ["Robotics"],
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
    // Simulate API delay
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
      <h1 className="text-2xl font-semibold">Events</h1>
      <div className="flex flex-wrap gap-4">
        {(events as any[]).map(
          (ev: {
            event_id: string;
            event_name: string;
            event_image_url: string;
          }) => (
            <div
              key={ev.event_id}
              className="flex flex-col gap-4 p-1.5 bg-secondary/40 rounded-2xl shadow-sm transition-colors duration-200 cursor-pointer border border-muted h-fit w-full md:w-fit"
            >
              <div className="flex gap-2 flex-col items-center">
                <img
                  src={ev.event_image_url}
                  alt={ev.event_name}
                  height={100}
                  width={100}
                  className="w-full h-fit rounded-2xl object-cover border border-muted"
                />
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold text-foreground">
                    {ev.event_name}
                  </h2>
                </div>
              </div>
              <div className="flex flex-row gap-2 justify-center">
                <Button
                  variant="secondary"
                  className="w-full text-center"
                  asChild
                >
                  <Link to="/dashboard/events/$eventId" params={{ eventId: ev.event_id }}>
                    <Notebook className="w-4 h-4" />
                    Event Details
                  </Link>
                </Button>
                <Button
                  variant="default"
                  className="w-fit text-center"
                  asChild
                >
                  <Link to="/dashboard/events/edit" search={{ id: ev.event_id }}>
                    <Edit3 className="w-4 h-4" />
                    Edit Event
                  </Link>
                </Button>
              </div>
            </div>
          ),
        )}
      </div>
      {(!events || (events as any[]).length === 0) && (
        <div className="flex flex-col items-center justify-center bg-muted/50 rounded-md shadow-sm py-4">
          <Binoculars className="w-24 h-24 my-2" />
          <p className="text-lg font-semibold text-foreground">
            No events found
          </p>
          <p className="text-sm text-card-foreground">
            Create a new event to get started
          </p>
          <hr className="border-t border-muted w-1/2 my-8" />
          <Button asChild>
            <Link to="/dashboard/events/new">
              <PlusCircle className="w-6 h-6" /> Create a new event
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}