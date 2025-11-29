import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/events/$eventId')({
  component: EventDetails,
})

function EventDetails() {
  const { eventId } = Route.useParams()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Event Details</h1>
      <p>Details for event with ID: {eventId}</p>
    </div>
  )
}
