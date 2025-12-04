import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { EditEventForm } from "@/components/events/edit-event-form";

const editSearchSchema = z.object({
  id: z.string().uuid(),
});

export const Route = createFileRoute("/dashboard/events/edit")({
  validateSearch: (search) => editSearchSchema.parse(search),
  component: EditEvent,
});

function EditEvent() {
  const { id } = Route.useSearch();

  return (
    <div className="max-w-[80%] mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Edit Event</h1>
      <p className="text-sm text-muted-foreground">
        Editing event with ID: {id}
      </p>

      <EditEventForm eventId={id} />
    </div>
  );
}
