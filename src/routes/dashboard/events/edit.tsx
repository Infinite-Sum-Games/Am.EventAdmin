import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const editSearchSchema = z.object({
  id: z.string().catch(''),
})

export const Route = createFileRoute('/dashboard/events/edit')({
  validateSearch: (search) => editSearchSchema.parse(search),
  component: EditEvent,
})

function EditEvent() {
  const { id } = Route.useSearch()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Edit Event</h1>
      <p>Editing event with ID: {id}</p>
      <p>Form to edit an event will go here.</p>
    </div>
  )
}
