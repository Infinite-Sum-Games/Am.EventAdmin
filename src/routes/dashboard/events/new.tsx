import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/events/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return EventEditorPage();
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEventEditorStore, type EventData } from "@/stores/useEventEditorStore";
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";

export function EventEditorPage() {

  const mockData: EventData = {
    attendance_mode: "SOLO",
    event_id: "fd0c3fd9-464b-4187-b6cc-5633968d51e7",
    event_name: "Sample Event",
    blurb: "This is a sample event for demonstration purposes.",
    description: "#Event Description\n\nThis event is designed to showcase the event editor functionality.",
    rules: "1. Be respectful.\n2. Follow the guidelines.",
    poster_url: "https://via.placeholder.com/600x400",
    is_published: true,
    event_type: "EVENT",
    is_group: false,
    is_offline: true,
    is_technical: false,
    price: 0,
    pricing_per_head: false,
    seat_count: 100,
    min_teamsize: 1,
    max_teamsize: 1,
    organizers: [
      { id: "org1", name: "Organizer One" },
      { id: "org2", name: "Organizer Two" },
    ],
    people: [
      { id: "person1", name: "Speaker One" },
      { id: "person2", name: "Speaker Two" },
    ],
    tags: [
      { id: "tag1", name: "Technology" },
      { id: "tag2", name: "Workshop" },
    ],
    schedules: [
      {
        id: "schedule1",
        event_date: "2024-10-15",
        start_time: "10:00",
        end_time: "12:00",
        venue: "Main Hall",
      },
      {
        id: "schedule2",
        event_date: "2024-10-16",
        start_time: "14:00",
        end_time: "16:00",
        venue: "Conference Room A",
      },
    ],
    // message from response
    message: "Event draft created successfully.",
  }
  
  const { eventData } = useEventEditorStore();

  if (!eventData) {
    useEventEditorStore.getState().initializeEvent(mockData);
  }

  if (!eventData) return <div className='text-center'>Loading Editor...</div>;

  return (
    <div className="container mx-auto py-10">
      <div className='flex flex-row justify-between'>
        <div className="flex flex-col justify-between">
          <h1 className="text-3xl font-bold">{eventData.event_name}</h1>
          <span className="text-sm text-muted-foreground">ID: {eventData.event_id}</span>
        </div>
        <div>
          <Button variant="outline" className="mr-4">Preview</Button>
          {eventData.is_published ? (
            <Button variant="destructive">Unpublish</Button>
          ) : (
            <Button>Publish</Button>
          )}
        </div>
      </div>
      <Separator className='my-4'/>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full mb-4 grid grid-cols-9 rounded-sm bg-popover h-10">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="seats">Seats</TabsTrigger>
          <TabsTrigger value="modes">Modes/Orgs/Tags</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div>General Content</div>
        </TabsContent>

        <TabsContent value="description">
          <div>Description Content</div>
        </TabsContent>

        <TabsContent value="rules">
          <div>Rules Content</div>
        </TabsContent>

        <TabsContent value="seats">
          <div>Seats Content</div>
        </TabsContent>

        <TabsContent value="modes">
          <div>Modes/Orgs/Tags Content</div>
        </TabsContent>

        <TabsContent value="pricing">
          <div>Pricing Content</div>
        </TabsContent>

        <TabsContent value="dependencies">
          <div>Dependencies Content</div>
        </TabsContent>

        <TabsContent value="scheduling">
          <div>Scheduling Content</div>
        </TabsContent>

        <TabsContent value="people">
          <div>People Content</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}