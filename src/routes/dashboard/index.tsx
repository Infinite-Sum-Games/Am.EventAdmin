import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Users, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import type { GetAllEventsResponse } from "@/types/events";
import secureLocalStorage from "react-secure-storage";
import { api } from "@/lib/api";

// --- Data Fetching ---
const eventsQueryOptions = queryOptions({
  queryKey: ['events'],
  queryFn: async () => {
    const token = secureLocalStorage.getItem("t");
    const res = await fetch(api.FETCH_ALL_EVENTS, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch events');
    }
    const data = await res.json();
    return data.events as GetAllEventsResponse[];
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
