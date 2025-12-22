import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { axiosClient } from "@/lib/axios";
import type { EventData } from "@/stores/useEventEditorStore";
import type { Participant } from "@/types/participants";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Binoculars, Building2, ChevronsUpDown, Loader2, Mail, MapPin, Check, ChevronLeft, ChevronRight, Search, Filter, Info } from "lucide-react"; // Added Info
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Added Tooltip imports

export const Route = createFileRoute("/dashboard/participants/")({
  component: ParticipantsOverviewPage,
});

const ITEMS_PER_PAGE = 24;

const searchFields = [
  { value: "student_name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "college", label: "College" },
  { value: "city", label: "City" },
  { value: "team_name", label: "Team" },
];

function ParticipantsOverviewPage() {
  const [open, setOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("student_name");

  // query to fetch all events for the combobox
  const { data: events = [] } = useQuery<EventData[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await axiosClient.get(api.FETCH_ALL_EVENTS);
      return response.data.events;
    },
  });

  const { data: participants = [], isLoading } = useQuery<Participant[]>({
    queryKey: ["participants", selectedEventId],
    queryFn: async () => {
      if (!selectedEventId) return [];
      const response = await axiosClient.get(api.FETCH_ALL_PARTICIPANTS_BY_EVENT(selectedEventId));
      return response.data.participants || [];
    },
    enabled: !!selectedEventId,
  });

  const handleSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentPage(1);
    setOpen(false);
  };

  const selectedEvent = events.find((event) => event.id === selectedEventId);

  const fuse = useMemo(() => new Fuse(participants, {
    keys: [searchField],
    threshold: 0.3,
    includeScore: true,
  }), [participants, searchField]);

  const filteredParticipants = useMemo(() => {
    if (!searchQuery) return participants;
    return fuse.search(searchQuery).map(result => result.item);
  }, [searchQuery, participants, fuse]);

  const totalPages = Math.ceil(filteredParticipants.length / ITEMS_PER_PAGE);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredParticipants.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredParticipants, currentPage]);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const { user: sessionUser } = Route.useRouteContext();

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Participants</h1>
          <p className="text-muted-foreground">
            Manage and view all registered participants for this event.
          </p>
        </div>
        {selectedEventId && filteredParticipants.length > 0 ? (
          <span className="text-muted-foreground text-lg font-medium">
            {filteredParticipants.length} participants
          </span>
        ) : null}
      </div>

      <TooltipProvider>
        {/* Unified Toolbar Component */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

          {/* Left Side: Event Selector */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 items-center">
            <div className="w-full sm:w-80">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-background"
                  >
                    {selectedEvent ? (
                      <span className="truncate font-medium text-foreground">
                        {selectedEvent.name}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-muted-foreground">
                        Choose Event...
                      </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search events..." />
                    <CommandList>
                      <CommandEmpty>No event found.</CommandEmpty>
                      <CommandGroup heading="Available Events">
                        {events?.map((event) => {
                          const isSelected = selectedEventId === event.id;
                          return (
                            <CommandItem
                              key={event.id}
                              value={event.name}
                              onSelect={() => event.id && handleSelect(event.id)}
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <span>{event.name}</span>
                              </div>
                              {isSelected && <Check className="ml-auto h-4 w-4" />}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Right Side: Search Controls */}
          <div className="w-full lg:w-auto flex gap-2">
            <Tooltip> {/* Added Tooltip here */}
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Select an event to view its participants.
                  <br />
                  Use the dropdown to filter participants by different fields using the search box.
                </p>
              </TooltipContent>
            </Tooltip>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search by ${searchFields.find(f => f.value === searchField)?.label || 'Name'}...`}
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9 bg-background"
                disabled={!selectedEventId}
              />
            </div>

            <Select value={searchField} onValueChange={setSearchField} disabled={!selectedEventId}>
              <SelectTrigger className="w-[140px] bg-background">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Field" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {searchFields.map(field => (
                  <SelectItem key={field.value} value={field.value}>{field.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </TooltipProvider>

      {/* Main Content Area */}
      <div>
        {isLoading ? (
          <div className="flex flex-col gap-4 h-[50vh] items-center justify-center text-muted-foreground">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
            <p className="text-sm font-medium">Loading participants...</p>
          </div>
        ) : !selectedEventId ? (
          <div className="flex flex-col items-center justify-center bg-muted/10 border-2 border-dashed border-muted rounded-xl py-16">
            <div className="bg-muted p-4 rounded-full mb-4">
              <Binoculars className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Select an Event</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4 text-center max-w-sm">
              Please select an event from the toolbar above to view its participants.
            </p>
          </div>
        ) : filteredParticipants.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentData.map((participant, index) => (
                <Card
                  key={index}
                  className="group overflow-hidden p-0 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-5 flex flex-col gap-4">

                    {/* Avatar */}
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {participant.student_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* Name & Team */}
                      <div className="flex flex-col min-w-0 space-y-2 justify-center ">
                        <h3 className="font-semibold text-lg leading-none truncate" title={participant.student_name}>
                          {participant.student_name}
                        </h3>

                        {participant.team_name && (
                          <Badge variant="secondary" className="px-1.5 py-0.5 max-w-full font-normal">
                            <span className="truncate">{participant.team_name}</span>
                          </Badge>
                        )}
                      </div>
                    </div>


                    <Separator />

                    {/* Details Section */}
                    <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">

                      {/* Email */}
                      <div className="flex items-center gap-3 min-w-0" title={participant.email}>
                        <div className="bg-muted p-1 rounded-md shrink-0">
                          <Mail className="w-4 h-4 text-foreground/70" />
                        </div>
                        <span className="truncate">{participant.email}</span>
                      </div>

                      {/* College */}
                      <div className="flex items-center gap-3 min-w-0" title={participant.college}>
                        <div className="bg-muted p-1 rounded-md shrink-0">
                          <Building2 className="w-4 h-4 text-foreground/70" />
                        </div>
                        <span className="truncate">{participant.college}</span>
                      </div>

                      {/* City */}
                      <div className="flex items-center gap-3 min-w-0" title={participant.city}>
                        <div className="bg-muted p-1 rounded-md shrink-0">
                          <MapPin className="w-4 h-4 text-foreground/70" />
                        </div>
                        <span className="truncate">{participant.city}</span>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls*/}
            {!isLoading && currentData.length > 0 && (
              <div className="flex items-center justify-between py-4 border-t mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredParticipants.length)} of {filteredParticipants.length} entries
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <span className="text-sm font-medium px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          // Empty State (Event Selected but no results)
          <div className="flex flex-col items-center justify-center bg-muted/10 border-2 border-dashed border-muted rounded-xl py-16 mt-4">
            <div className="bg-muted p-4 rounded-full mb-4">
              <Binoculars className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No participants found</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4 text-center max-w-sm">
              {searchQuery ? `No results for "${searchQuery}"` : `There are no participants registered for ${selectedEvent?.name} yet.`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}