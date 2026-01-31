"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { EventData } from "@/stores/useEventEditorStore";

interface ParticipantsTableToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchField: string;
  onSearchFieldChange: (field: string) => void;
  selectedEvent: EventData | null;
  onEventChange: (event: EventData | null) => void;
  events: EventData[];
  filteredCount: number;
  totalCount: number;
  isLoadingEvents?: boolean;
}

const searchFields = [
  { value: "all", label: "All Fields" },
  { value: "student_name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "college", label: "College" },
  { value: "city", label: "City" },
  { value: "team_name", label: "Team Name" },
];

export function ParticipantsTableToolbar({
  searchQuery,
  onSearchChange,
  searchField,
  onSearchFieldChange,
  selectedEvent,
  onEventChange,
  events,
  filteredCount,
  totalCount,
  isLoadingEvents = false,
}: ParticipantsTableToolbarProps) {
  const [isEventPopoverOpen, setIsEventPopoverOpen] = useState(false);

  return (
    <div className="flex items-center justify-between space-y-2 py-4">
      {/* Search Section */}
      <div className="flex flex-1 items-center space-x-2">
        {/* Search Field Selector */}
        <Select value={searchField} onValueChange={onSearchFieldChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Search field" />
          </SelectTrigger>
          <SelectContent>
            {searchFields.map((field) => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Search by ${searchFields.find(f => f.value === searchField)?.label.toLowerCase() || 'all fields'}...`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Active Filters Badge */}
        {(searchQuery || selectedEvent) && (
          <div className="flex items-center gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                <Search className="h-3 w-3" />
                {searchQuery.substring(0, 20)}{searchQuery.length > 20 && '...'}
              </Badge>
            )}
            {selectedEvent && (
              <Badge variant="secondary" className="gap-1">
                <Filter className="h-3 w-3" />
                {selectedEvent.name}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSearchChange('');
                onEventChange(null);
              }}
              className="h-6 px-2"
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Event Filter Section */}
      <Popover open={isEventPopoverOpen} onOpenChange={setIsEventPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-[200px] justify-start">
            <Filter className="mr-2 h-4 w-4" />
            {selectedEvent ? selectedEvent.name : "All Events"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <div className="max-h-[300px] overflow-y-auto p-1">
            {isLoadingEvents ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-normal"
                  onClick={() => {
                    onEventChange(null);
                    setIsEventPopoverOpen(false);
                  }}
                >
                  All Events
                </Button>
                {events.map((event) => (
                  <Button
                    key={event.id}
                    variant="ghost"
                    className="w-full justify-start font-normal"
                    onClick={() => {
                      onEventChange(event);
                      setIsEventPopoverOpen(false);
                    }}
                  >
                    {event.name}
                  </Button>
                ))}
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Results Summary */}
      <div className="flex items-center text-sm text-muted-foreground">
        {filteredCount !== totalCount ? (
          <span>
            {filteredCount} of {totalCount} participants
          </span>
        ) : (
          <span>{totalCount} participants</span>
        )}
      </div>
    </div>
  );
}