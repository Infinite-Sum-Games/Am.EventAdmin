import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { queryOptions, useMutation, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { MultiSelect } from "@/components/ui/multi-select";
import { EventCard } from "@/components/events/event-card";
import { Loader2, Plus, Search } from "lucide-react";
import { api } from "@/lib/api";
import secureLocalStorage from "react-secure-storage";
import { type EventData } from "@/stores/useEventEditorStore";
import { axiosClient } from "@/lib/axios";
import { toast } from "sonner";

// --- Dummy Data for Filters (To be replaced by API calls if available) ---
const dummyTagsForFilter = [
  "Technology",
  "Coding",
  "Competition",
  "Robotics",
  "Workshop",
  "STEM",
  "Arts",
  "Exhibition",
  "Art",
  "Tech",
];
const dummyOrganizersForFilter = [
  "Tech Club",
  "CSE Department",
  "Mechanical Department",
  "Arts Club",
];

// --- Data Fetching ---
const eventsQueryOptions = queryOptions({
  queryKey: ["events"],
  queryFn: async () => {
    const token = secureLocalStorage.getItem("t");
    const res = await fetch(api.FETCH_ALL_EVENTS, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch events");
    }
    const data = await res.json();
    // Assuming the API response structure is { events: [...], message: "..." }
    // And that event_image_url can be null, we'll provide a fallback.
    console.log("Data fetched: ", data.events);
    return data.events.map((event: EventData) => ({
      ...event,
      poster_url:
        event.poster_url ||
        "https://images.unsplash.com/photo-1501281668745-f7f5792d7cdd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Fallback image
    })) as EventData[];
  },
});

const tagsForFilterQueryOptions = queryOptions({
  queryKey: ["tagsForFilter"],
  queryFn: () => dummyTagsForFilter.map((t) => ({ value: t, label: t })),
});

const orgsForFilterQueryOptions = queryOptions({
  queryKey: ["orgsForFilter"],
  queryFn: () => dummyOrganizersForFilter.map((o) => ({ value: o, label: o })),
});

export const Route = createFileRoute("/dashboard/events/")({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(eventsQueryOptions);
    queryClient.ensureQueryData(tagsForFilterQueryOptions);
    queryClient.ensureQueryData(orgsForFilterQueryOptions);
  },
  component: ViewEventsPage,
});

function ViewEventsPage() {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: events } = useSuspenseQuery(eventsQueryOptions);
  const { data: tagsForFilter } = useSuspenseQuery(tagsForFilterQueryOptions);
  const { data: orgsForFilter } = useSuspenseQuery(orgsForFilterQueryOptions);

  // Derive unique event dates from fetched events
  // const uniqueEventDates = useMemo(() => {
  //   const dates = new Set(
  //     events
  //       .filter(event => event.)
  //       .map(event => event.event_date.split('T')[0])
  //   );
  //   return [...dates].sort();
  // }, [events]);

  const maxPrice = useMemo(() => {
    if (!events || events.length === 0) return 10000;
    return Math.max(...events.map((e) => e.price));
  }, [events]);

  // --- Filter States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [priceRange, setPriceRange] = useState([maxPrice]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]); // This filter is currently inactive without organizer_name in event object

  // Reset price range when the max price from data changes
  useEffect(() => {
    setPriceRange([maxPrice]);
  }, [maxPrice]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // const eventDate = event.event_date.split('T')[0]; // Compare only YYYY-MM-DD
      if (searchTerm && !event.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (statusFilter !== 'ALL' && event.event_status !== statusFilter) return false;
      // if (dateFilter !== 'ALL' && event.date !== dateFilter) return false;
      if (event.price > priceRange[0]) return false;
      if (selectedTags.length > 0 && !selectedTags.every(tag => event.tags.includes(tag))) return false;
      // Organizer filter is disabled as organizer_name is not in the API response
      // if (selectedOrgs.length > 0 && !selectedOrgs.includes(event.organizer_name)) return false;
      return true;
    });
  }, [events, searchTerm, statusFilter, dateFilter, priceRange, selectedTags, selectedOrgs]); // Removed selectedOrgs from dependencies as filter is commented

  const { mutate: handleCreateEvent, isPending: isCreating } = useMutation({
    mutationFn: async () => {
      const response = await axiosClient.get(api.CREATE_EVENT);
      console.log("Create Event Response:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['event', data.id], data);
      navigate({ to: `/dashboard/events/${data.id}` })
    },
    onError: () => {
      // console.error("Failed to create event draft:", error);
      toast.error("Failed to initialize event");
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">View Events</h1>
        <Button onClick={() => handleCreateEvent()} disabled={isCreating}>
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create New Event
            </>
          )}
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
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={(value) => setDateFilter(value)}>
          <SelectTrigger><SelectValue placeholder="Filter by date..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Dates</SelectItem>
            {/* {uniqueEventDates.map(date => <SelectItem key={date} value={date}>{new Date(date).toLocaleDateString()}</SelectItem>)} */}
          </SelectContent>
        </Select>
        <MultiSelect data={tagsForFilter} name="Tags" selected={selectedTags} setSelected={setSelectedTags} />
        <MultiSelect data={orgsForFilter} name="Organizers" selected={selectedOrgs} setSelected={setSelectedOrgs} />
        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted-foreground">Max Price: ₹{priceRange[0]}</label>
          <Slider value={priceRange} max={maxPrice} step={1000} onValueChange={setPriceRange} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}