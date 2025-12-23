import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { api } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Trophy, 
  Wrench, 
  Users, 
  User, 
  ArrowUpDown, 
  Loader2, 
  IndianRupee,
  Filter
} from "lucide-react";
import type { Leaderboard } from "@/types/dashboard-table";


export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverviewPage,
});

type SortOption = 
  | "revenue-desc" | "revenue-asc"
  | "seats-desc" | "seats-asc"
  | "participants-desc" | "participants-asc";

function DashboardOverviewPage() {
  // states
  const [typeFilter, setTypeFilter] = useState<"ALL" | "EVENT" | "WORKSHOP">("ALL");
  const [groupFilter, setGroupFilter] = useState<"ALL" | "INDIVIDUAL" | "TEAM">("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("revenue-desc");

  const { data: leaderboardData = [], isLoading } = useQuery<Leaderboard[]>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const response = await axiosClient.get(api.FETCH_LEADERBOARD);
      return response.data.events;
    }
  });


  // --- Processing Data ---
  const processedData = useMemo(() => {
    let result = [...leaderboardData];

    // 1. Filter by Type
    if (typeFilter !== "ALL") {
      result = result.filter(item => item.event_type === typeFilter);
    }

    // 2. Filter by Group Mode
    if (groupFilter === "TEAM") {
      result = result.filter(item => item.is_group);
    } else if (groupFilter === "INDIVIDUAL") {
      result = result.filter(item => !item.is_group);
    }

    // 3. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "revenue-desc": return b.revenue - a.revenue;
        case "revenue-asc": return a.revenue - b.revenue;
        
        case "seats-desc": return b.seats_filled - a.seats_filled;
        case "seats-asc": return a.seats_filled - b.seats_filled;

        case "participants-desc": return b.actual_participant_count - a.actual_participant_count;
        case "participants-asc": return a.actual_participant_count - b.actual_participant_count;
        
        default: return 0;
      }
    });

    return result;
  }, [leaderboardData, typeFilter, groupFilter, sortBy]);

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Real-time analytics of your top performing events and workshops.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row justify-between gap-4 items-start xl:items-center">
        
        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
          {/* Filter: Event Type */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground ml-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Event Type
            </span>
            <ToggleGroup 
              type="single" 
              value={typeFilter} 
              onValueChange={(val) => val && setTypeFilter(val as any)}
              variant="outline"
              className="justify-start"
            >
              <ToggleGroupItem value="ALL" className="h-9 px-3">All</ToggleGroupItem>
              <ToggleGroupItem value="EVENT" className="h-9 px-3">Events</ToggleGroupItem>
              <ToggleGroupItem value="WORKSHOP" className="h-9 px-3">Workshops</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="hidden md:block w-px bg-border h-12 mx-2 self-center" />

          {/* Filter: Participation Mode */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground ml-1 flex items-center gap-1">
              <Users className="w-3 h-3" /> Mode
            </span>
            <ToggleGroup 
              type="single" 
              value={groupFilter} 
              onValueChange={(val) => val && setGroupFilter(val as any)}
              variant="outline"
              className="justify-start"
            >
              <ToggleGroupItem value="ALL" className="h-9 px-3 ">All</ToggleGroupItem>
              <ToggleGroupItem value="INDIVIDUAL" className="h-9 px-3 ">Individual</ToggleGroupItem>
              <ToggleGroupItem value="TEAM" className="h-9 px-3 ">Team</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="space-y-1.5 w-full xl:w-auto">
            <span className="text-xs font-medium text-muted-foreground ml-1 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> Sort Order
            </span>
            <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
                <SelectTrigger className="w-full xl:w-[220px] bg-background">
                    <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="revenue-desc">Revenue: High to Low</SelectItem>
                    <SelectItem value="revenue-asc">Revenue: Low to High</SelectItem>
                    <SelectItem value="seats-desc">Registrations: High to Low</SelectItem>
                    <SelectItem value="seats-asc">Registrations: Low to High</SelectItem>
                    <SelectItem value="participants-desc">Headcount: High to Low</SelectItem>
                    <SelectItem value="participants-asc">Headcount: Low to High</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
      {/* Table Section */}
      <Card className="overflow-hidden border-muted p-0 rounded-md">
        <CardContent className="p-0">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead className="w-[50px] text-center">#</TableHead>
                        <TableHead className="w-[300px]">Event Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Participation Stats</TableHead>
                        <TableHead className="text-right pr-6">Revenue</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                         <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Loading data...
                                </div>
                            </TableCell>
                         </TableRow>
                    ) : processedData.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No events found matching your filters.
                            </TableCell>
                         </TableRow>
                    ) : (
                        processedData.map((event, index) => (
                            <TableRow key={event.event_id} className="group hover:bg-muted/30 h-14">
                                <TableCell className="text-center font-medium text-muted-foreground">
                                    {index + 1}
                                </TableCell>
                                <TableCell className="font-medium text-foreground">
                                    {event.event_name}
                                </TableCell>
                                <TableCell>
                                    {event.event_type === "WORKSHOP" ? (
                                        <Badge variant="secondary" className="w-24 flex justify-center text-yellow-500">
                                            <Wrench className="w-3 h-3 mr-1" /> Workshop
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="w-24 flex justify-center text-green-500">
                                            <Trophy className="w-3 h-3 mr-1" /> Event
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {event.is_group ? (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="w-4 h-4" /> Team
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="w-4 h-4" /> Individual
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {event.is_group ? (
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm">
                                                {event.seats_filled} / {event.total_seats} Teams
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                ({event.actual_participant_count} Total Participants)
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="font-medium">
                                             {event.seats_filled} / {event.total_seats} Seats
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-bold tabular-nums pr-6">
                                    <div className="flex items-center justify-end">
                                        <IndianRupee className="w-3 h-3  mr-0.5" />
                                        {event.revenue.toLocaleString('en-IN')}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                    {/* // row with total Stats */}
                    {(!isLoading && processedData.length > 0) && (
                      <TableRow className="bg-muted/50 h-14">
                          <TableCell colSpan={4} className="font-bold text-lg">
                              Total
                          </TableCell>
                          <TableCell className="font-bold text-lg">
                              {processedData.reduce((sum, event) => sum + event.seats_filled, 0)} / {processedData.reduce((sum, event) => sum + event.total_seats, 0)} Seats
                          </TableCell>
                          <TableCell className="text-right font-bold text-lg tabular-nums pr-6">
                              <div className="flex items-center justify-end">
                                  <IndianRupee className="w-4 h-4 mr-0.5" />
                                  {processedData.reduce((sum, event) => sum + event.revenue, 0).toLocaleString('en-IN')}
                              </div>
                          </TableCell>
                      </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  )
}