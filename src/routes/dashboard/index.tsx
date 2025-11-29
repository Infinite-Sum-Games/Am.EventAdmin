import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Users, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import type { GetAllEventsResponse } from "@/types/events";

// --- Dummy Data ---
// This data is fetched to calculate the stats on the dashboard.
const dummyEvents: GetAllEventsResponse[] = [
  { "event_id": "event-1", "event_name": "Hackathon", "event_status": "ACTIVE", "is_group": true, "tags": ["Technology", "Coding", "Competition"], "event_price": 500, "max_seats": 200, "seats_filled": 120, "event_image_url": "", "event_description": "", "event_date": "", "is_registered": false, "is_starred": false },
  { "event_id": "event-2", "event_name": "Robotics Workshop", "event_status": "ACTIVE", "is_group": false, "tags": ["Robotics", "Workshop", "STEM"], "event_price": 300, "max_seats": 100, "seats_filled": 80, "event_image_url": "", "event_description": "", "event_date": "", "is_registered": false, "is_starred": false },
  { "event_id": "event-3", "event_name": "Art Exhibition", "event_status": "CLOSED", "is_group": false, "tags": ["Arts", "Exhibition"], "event_price": 0, "max_seats": 500, "seats_filled": 450, "event_image_url": "", "event_description": "", "event_date": "", "is_registered": true, "is_starred": true }
];

// --- Data Fetching ---
const eventsQueryOptions = queryOptions({
  queryKey: ["events"], // Re-uses the same query key as the events list
  queryFn: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return dummyEvents;
  },
});

export const Route = createFileRoute("/dashboard/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(eventsQueryOptions),
  component: DashboardOverviewPage,
});

function DashboardOverviewPage() {
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
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString("en-IN")}`} icon={IndianRupee} description="Total revenue generated from all events." />
        <StatCard title="Total Participants" value={`+${totalParticipants.toLocaleString("en-IN")}`} icon={Users} description="Total seats filled across all events." />
        <StatCard title="Active Events" value={activeEvents.toString()} icon={Activity} description="Number of events currently active." />
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Participants per Event</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Bar dataKey="participants" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
