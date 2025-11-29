import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Binoculars, Edit3, Notebook, PlusCircle } from "lucide-react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

// Define a query for fetching events
const eventsQueryOptions = queryOptions({
  queryKey: ["events"],
  queryFn: async () => {
    const res = await fetch(api.ALL_EVENTS_URL);
    if (!res.ok) {
      throw new Error("Failed to fetch events");
    }
    const data = await res.json();
    return data.DATA; // Assuming the API returns { DATA: [...] }
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
            eventID: number;
            eventName: string;
            eventImageUrl: string;
          }) => (
            <div
              key={ev.eventID}
              className="flex flex-col gap-4 p-1.5 bg-secondary/40 rounded-2xl shadow-sm transition-colors duration-200 cursor-pointer border border-muted h-fit w-full md:w-fit"
            >
              <div className="flex gap-2 flex-col items-center">
                <img
                  src={ev.eventImageUrl}
                  alt={ev.eventName}
                  height={100}
                  width={100}
                  className="w-full h-fit rounded-2xl object-cover border border-muted"
                />
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold text-foreground">
                    {ev.eventName}
                  </h2>
                </div>
              </div>
              <div className="flex flex-row gap-2 justify-center">
                <Button
                  variant="secondary"
                  className="w-full text-center"
                  asChild
                >
                  <Link to="/dashboard/events/$eventId" params={{ eventId: ev.eventID.toString() }}>
                    <Notebook className="w-4 h-4" />
                    Event Details
                  </Link>
                </Button>
                <Button
                  variant="default"
                  className="w-fit text-center"
                  asChild
                >
                  <Link to="/dashboard/events/edit" search={{ id: ev.eventID.toString() }}>
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
