import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/events/new')({
  component: NewEvent,
})

function NewEvent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Create New Event</h1>
      <p>Form to create a new event will go here.</p>
    </div>
  )
}
