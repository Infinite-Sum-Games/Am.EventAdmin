import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, IndianRupee, Users, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { EventCard } from "@/components/events/event-card";
import type { GetAllEventsResponse } from "@/types/events";

// --- Dummy Data ---
const dummyEvents: GetAllEventsResponse[] = [
  { "event_id": "event-1", "event_name": "Hackathon", "event_status": "ACTIVE", "is_group": true, "tags": ["Technology", "Coding", "Competition"], "event_price": 500, "max_seats": 200, "seats_filled": 120, "event_image_url": "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2231&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "event_description": "A 24-hour coding marathon where innovators and developers come together to solve real-world problems.", "event_date": "2025-02-10", "is_registered": false, "is_starred": false },
  { "event_id": "event-2", "event_name": "Robotics Workshop", "event_status": "ACTIVE", "is_group": false, "tags": ["Robotics", "Workshop", "STEM"], "event_price": 300, "max_seats": 100, "seats_filled": 80, "event_image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "event_description": "An immersive, hands-on workshop covering the fundamentals of robotics, from building to programming.", "event_date": "2025-02-12", "is_registered": false, "is_starred": false },
  { "event_id": "event-3", "event_name": "Art Exhibition", "event_status": "CLOSED", "is_group": false, "tags": ["Arts", "Exhibition"], "event_price": 0, "max_seats": 500, "seats_filled": 450, "event_image_url": "https://images.unsplash.com/photo-1547891654-e66ed711b931?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "event_description": "A curated exhibition showcasing diverse talents in painting, sculpture, and digital art.", "event_date": "2025-02-08", "is_registered": true, "is_starred": true }
];

// --- Data Fetching ---
const eventsQueryOptions = queryOptions({
  queryKey: ["events"],
  queryFn: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
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

  // Calculate stats from data
  const totalRevenue = events.reduce((acc, event) => acc + (event.event_price * event.seats_filled), 0);
  const totalParticipants = events.reduce((acc, event) => acc + event.seats_filled, 0);
  const activeEvents = events.filter(event => event.event_status === 'ACTIVE').length;

  const chartData = events.map(event => ({
    name: event.event_name.length > 15 ? `${event.event_name.substring(0, 15)}...` : event.event_name,
    participants: event.seats_filled,
  }));

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={IndianRupee} description="Total revenue generated from all events." />
        <StatCard title="Total Participants" value={`+${totalParticipants.toLocaleString('en-IN')}`} icon={Users} description="Total seats filled across all events." />
        <StatCard title="Active Events" value={activeEvents.toString()} icon={Activity} description="Number of events currently active." />
      </div>

      <Tabs defaultValue="events">
        <div className="flex items-center justify-between">
            <TabsList>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <Button asChild>
                <Link to="/dashboard/events/new">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create New Event
                </Link>
            </Button>
        </div>

        <TabsContent value="events">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            {events.map((event) => (
              <EventCard key={event.event_id} event={event} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="p-2">
            <Card>
                <CardHeader>
                    <CardTitle>Participants per Event</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Bar dataKey="participants" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}