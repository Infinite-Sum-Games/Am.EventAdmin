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

  const processedData = useMemo(() => {
    let result = [...leaderboardData];

    if (typeFilter !== "ALL") {
      result = result.filter(item => item.event_type === typeFilter);
    }

    if (groupFilter === "TEAM") {
      result = result.filter(item => item.is_group);
    } else if (groupFilter === "INDIVIDUAL") {
      result = result.filter(item => !item.is_group);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "revenue-desc": return b.revenue_without_gst - a.revenue_without_gst;
        case "revenue-asc": return a.revenue_without_gst - b.revenue_without_gst;
        case "seats-desc": return b.seats_filled - a.seats_filled;
        case "seats-asc": return a.seats_filled - b.seats_filled;
        case "participants-desc": return b.actual_participant_count - a.actual_participant_count;
        case "participants-asc": return a.actual_participant_count - b.actual_participant_count;
        default: return 0;
      }
    });

    return result;
  }, [leaderboardData, typeFilter, groupFilter, sortBy]);

  const totalStats = useMemo(() => {
    return processedData.reduce((acc, curr) => ({
      revenue: acc.revenue + curr.revenue,
      revenue_without_gst: acc.revenue_without_gst + curr.revenue_without_gst,
      seats_filled: acc.seats_filled + curr.seats_filled,
      total_seats: acc.total_seats + curr.total_seats,
      participants: acc.participants + curr.actual_participant_count
    }), { revenue: 0, revenue_without_gst: 0, seats_filled: 0, total_seats: 0, participants: 0 });
  }, [processedData]);

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto pb-28">

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
          {/* Event Type Filter */}
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

          {/* Mode Filter */}
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

        {/* Sort */}
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
      <Card className="overflow-hidden border-muted p-0 rounded-md shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="grid grid-cols-[50px_300px_1fr_1fr_1fr_1fr]">
                <TableHead className="text-center flex items-center justify-center">#</TableHead>
                <TableHead className="flex items-center">Event Name</TableHead>
                <TableHead className="flex items-center">Type</TableHead>
                <TableHead className="flex items-center">Mode</TableHead>
                <TableHead className="flex items-center">Participation Stats</TableHead>
                <TableHead className="text-right flex items-center justify-end pr-6">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="block">
              {isLoading ? (
                <TableRow className="grid grid-cols-1">
                  <TableCell className="h-24 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading data...
                    </div>
                  </TableCell>
                </TableRow>
              ) : processedData.length === 0 ? (
                <TableRow className="grid grid-cols-1">
                  <TableCell className="h-24 flex items-center justify-center text-muted-foreground">
                    No events found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                processedData.map((event, index) => (
                  <TableRow key={event.event_id} className="grid grid-cols-[50px_300px_1fr_1fr_1fr_1fr] group hover:bg-muted/30 h-14">
                    <TableCell className="text-center font-medium text-muted-foreground flex items-center justify-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium text-foreground flex items-center truncate">
                      {event.event_name}
                    </TableCell>
                    <TableCell className="flex items-center">
                      {event.event_type === "WORKSHOP" ? (
                        <Badge variant="secondary" className="w-24 flex justify-center text-yellow-600 bg-yellow-50 border-yellow-200">
                          <Wrench className="w-3 h-3 mr-1" /> Workshop
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="w-24 flex justify-center text-green-600 bg-green-50 border-green-200">
                          <Trophy className="w-3 h-3 mr-1" /> Event
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="flex items-center">
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
                    <TableCell className="flex items-center">
                      {event.is_group ? (
                        <div className="flex flex-col justify-center">
                          <span className="font-semibold text-sm">
                            {event.seats_filled} / {event.total_seats} Teams
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({event.actual_participant_count} Participants)
                          </span>
                        </div>
                      ) : (
                        <div className="font-medium">
                          {event.seats_filled} / {event.total_seats} Seats
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-bold tabular-nums pr-6 flex flex-col items-end justify-center">
                      <div className="flex items-center">
                        <IndianRupee className="w-3 h-3 mr-0.5" />
                        {event.revenue_without_gst.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-muted-foreground font-normal">
                        (w/GST: {event.revenue.toLocaleString('en-IN')})
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Floating Total Row */}
      {(!isLoading && processedData.length > 0) && (
        <div
          className="fixed bottom-6 right-0 z-50 px-4 flex justify-center pointer-events-none left-0 lg:left-[var(--sidebar-width)] transition-[left] duration-300"
        >
          {/* Matches max-w-7xl of the main container */}
          <div className="w-full max-w-7xl pointer-events-auto">
            {/* The Floating 'Row' Div */}
            <div className="bg-muted/90 backdrop-blur-md border border-border shadow-2xl rounded-lg overflow-hidden">
              {/* Grid Layout Matches Table exactly */}
              <div className="grid grid-cols-[50px_300px_1fr_1fr_1fr_1fr] h-16 items-center px-4">

                {/* "Total" Label spans first 4 columns */}
                <div className="col-span-4 pl-4 text-lg font-bold flex items-center">
                  Total
                </div>

                {/* Participation Stats Column */}
                <div className="font-bold text-lg flex flex-col justify-center">
                  <span>
                    {totalStats.seats_filled} / {totalStats.total_seats} Seats
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">
                    ({totalStats.participants} Total Headcount)
                  </span>
                </div>

                {/* Revenue Column */}
                <div className="text-right font-bold text-lg tabular-nums pr-4 flex flex-col items-end justify-center text-primary">
                  <div className="flex items-center">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    {totalStats.revenue_without_gst.toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-muted-foreground font-normal">
                    (w/GST: {totalStats.revenue.toLocaleString('en-IN')})
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}