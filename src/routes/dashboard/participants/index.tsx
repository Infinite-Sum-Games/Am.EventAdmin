import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/lib/api";
import { axiosClient } from "@/lib/axios";
import type { EventData } from "@/stores/useEventEditorStore";
import type { Participant } from "@/types/participants";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Binoculars, ChevronsUpDown, Loader2, Check } from "lucide-react";
import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ParticipantsTable } from "@/components/participants/participants-table";

import { RestrictedAccess } from "@/components/restricted-access";

export const Route = createFileRoute("/dashboard/participants/")({
  component: ParticipantsOverviewPage,
});

function ParticipantsOverviewPage() {
  const { user: sessionUser } = Route.useRouteContext();
  
  const restrictedEmails = ["finance@amrita.edu", "pnr@amrita.edu"];

  if (restrictedEmails.includes(sessionUser.email)) {
    return <RestrictedAccess />;
  }

  const [open, setOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<keyof Participant | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
  console.log("Participants Data:", participants);  

  const handleSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    setOpen(false);
  };

  const handleSortChange = (column: keyof Participant, direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const selectedEvent = events.find((event) => event.id === selectedEventId);
  
  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Participants</h1>
          <p className="text-muted-foreground">
            Manage and view all registered participants for this event.
          </p>
        </div>
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

          {/* Right Side: Participants count */}
          {participants.length > 0 && selectedEventId && (
                      <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-lg font-medium">
              {participants.length} participants
            </span>
          </div>
          )}
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
        ) : participants.length > 0 ? (
          <ParticipantsTable
            data={participants}
            loading={isLoading}
            onSortChange={handleSortChange}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            defaultPageSize={25}
          />
        ) : (
          // Empty State (Event Selected but no results)
          <div className="flex flex-col items-center justify-center bg-muted/10 border-2 border-dashed border-muted rounded-xl py-16 mt-4">
            <div className="bg-muted p-4 rounded-full mb-4">
              <Binoculars className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No participants found</h3>
          </div>
        )}
      </div>
    </div>
  );
}