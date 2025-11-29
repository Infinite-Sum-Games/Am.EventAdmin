import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { MultiSelect } from "@/components/ui/multi-select";
import { EventCard } from "@/components/events/event-card";
import type { GetAllEventsResponse } from "@/types/events";
import { PlusCircle, Search } from "lucide-react";
import { api } from "@/lib/api";

// --- Dummy Data ---
const dummyTagsForFilter = ["Technology", "Coding", "Competition", "Robotics", "Workshop", "STEM", "Arts", "Exhibition"];
const dummyOrganizersForFilter = ["Tech Club", "CSE Department", "Mechanical Department"];
const dummyEvents: (GetAllEventsResponse & { organizer_name: string })[] = [
    { "event_id": "event-1", "event_name": "Hackathon", "event_status": "ACTIVE", "is_group": true, "tags": ["Technology", "Coding", "Competition"], "event_price": 500, "max_seats": 200, "seats_filled": 120, "event_image_url": "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2231&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "event_description": "A 24-hour coding marathon where innovators and developers come together to solve real-world problems.", "event_date": "2025-02-10", "is_registered": false, "is_starred": false, "organizer_name": "Tech Club" },
    { "event_id": "event-2", "event_name": "Robotics Workshop", "event_status": "ACTIVE", "is_group": false, "tags": ["Robotics", "Workshop", "STEM"], "event_price": 300, "max_seats": 100, "seats_filled": 80, "event_image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "event_description": "An immersive, hands-on workshop covering the fundamentals of robotics, from building to programming.", "event_date": "2025-02-12", "is_registered": false, "is_starred": false, "organizer_name": "CSE Department" },
    { "event_id": "event-3", "event_name": "Art Exhibition", "event_status": "CLOSED", "is_group": false, "tags": ["Arts", "Exhibition"], "event_price": 0, "max_seats": 500, "seats_filled": 450, "event_image_url": "https://images.unsplash.com/photo-1547891654-e66ed711b931?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "event_description": "A curated exhibition showcasing diverse talents in painting, sculpture, and digital art.", "event_date": "2025-02-08", "is_registered": true, "is_starred": true, "organizer_name": "Arts Club" }
];
const uniqueEventDates = [...new Set(dummyEvents.map(event => event.event_date))];

// --- Data Fetching ---
const eventsQueryOptions = queryOptions({ queryKey: ['events'], queryFn: () => dummyEvents });
const tagsQueryOptions = queryOptions({ queryKey: ['tagsForFilter'], queryFn: () => dummyTagsForFilter.map(t => ({ value: t, label: t })) });
const orgsQueryOptions = queryOptions({ queryKey: ['orgsForFilter'], queryFn: () => dummyOrganizersForFilter.map(o => ({ value: o, label: o })) });

export const Route = createFileRoute("/dashboard/events/")({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(eventsQueryOptions);
    queryClient.ensureQueryData(tagsQueryOptions);
    queryClient.ensureQueryData(orgsQueryOptions);
  },
  component: ViewEventsPage,
});

function ViewEventsPage() {
  const { data: events } = useSuspenseQuery(eventsQueryOptions);
  const { data: tagsForFilter } = useSuspenseQuery(tagsQueryOptions);
  const { data: orgsForFilter } = useSuspenseQuery(orgsQueryOptions);

  // --- Filter States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [priceRange, setPriceRange] = useState([1000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
        if (searchTerm && !event.event_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        if (statusFilter !== 'ALL' && event.event_status !== statusFilter) return false;
        if (dateFilter !== 'ALL' && event.event_date !== dateFilter) return false;
        if (event.event_price > priceRange[0]) return false;
        if (selectedTags.length > 0 && !selectedTags.every(tag => event.tags.includes(tag))) return false;
        if (selectedOrgs.length > 0 && !selectedOrgs.includes(event.organizer_name)) return false;
        return true;
    });
  }, [events, searchTerm, statusFilter, dateFilter, priceRange, selectedTags, selectedOrgs]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">View Events</h1>
        <Button asChild>
            <Link to="/dashboard/events/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Event
            </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder="Search by event name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
            <SelectTrigger><SelectValue placeholder="Filter by status..." /></SelectTrigger>
            <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={(value) => setDateFilter(value)}>
            <SelectTrigger><SelectValue placeholder="Filter by date..." /></SelectTrigger>
            <SelectContent>
                <SelectItem value="ALL">All Dates</SelectItem>
                {uniqueEventDates.map(date => <SelectItem key={date} value={date}>{new Date(date).toLocaleDateString()}</SelectItem>)}
            </SelectContent>
        </Select>
        <MultiSelect data={tagsForFilter} name="Tags" selected={selectedTags} setSelected={setSelectedTags} />
        <MultiSelect data={orgsForFilter} name="Organizers" selected={selectedOrgs} setSelected={setSelectedOrgs} />
        <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Max Price: ₹{priceRange[0]}</label>
            <Slider value={priceRange} max={1000} step={50} onValueChange={setPriceRange} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <EventCard key={event.event_id} event={event} />
        ))}
      </div>
    </div>
  );
}