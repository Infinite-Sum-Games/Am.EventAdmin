"use client";

import { createFileRoute } from "@tanstack/react-router";
import { EventDetails } from "@/components/events/Eventdetails";

export const Route = createFileRoute("/dashboard/events/$eventId")({
  component: EventDetailsPage,
});

function EventDetailsPage() {
  const { eventId } = Route.useParams();
  return <EventDetails eventId={eventId} />;
}
