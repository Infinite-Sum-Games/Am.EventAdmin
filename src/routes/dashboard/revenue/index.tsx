import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { axiosClient } from "@/lib/axios";
import type { RevenueSummary } from "@/types/analytics";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, PartyPopper, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

export const Route = createFileRoute("/dashboard/revenue/")({
  component: RevenueOverviewPage,
});

function RevenueOverviewPage() {

  const { data: revenueSummary, isLoading, isError } = useQuery<RevenueSummary>({
    queryKey: ['revenueSummary'],
    queryFn: async () => {
      const response = await axiosClient.get(api.REVENUE_SUMMARY);
      return response.data.revenue_summary;
    }
  });

  return (
    <div className="flex flex-col gap-4 p-4 max-w-7xl mx-auto">
      <div className="flex flex-row gap-4 items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Revenue</h1>
          <p className="text-muted-foreground">Manage your revenue streams and financial performance.</p>
        </div>
      </div>
      {isLoading ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Revenue"
          value={`₹ ${revenueSummary?.total_revenue.toLocaleString() ?? '0'}`}
          icon={DollarSign}
        />
        <StatCard
          title="Organizers"
          value={revenueSummary?.revenue_per_organizer.length.toString() ?? '0'}
          icon={Users}
        />
        <StatCard
          title="Events"
          value={revenueSummary?.revenue_per_event.length.toString() ?? '0'}
          icon={PartyPopper}
        />
      </div>}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
        {isLoading ? <>
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </> : <>
          <Card>
            <CardHeader>
              <CardTitle>Revenue Distribution (Top 10 Events)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                revenue: {
                  label: "Revenue",
                  color: "var(--primary)", // Remove hsl() wrapper
                },
              }} className="h-80 w-full">
                <BarChart
                  data={revenueSummary?.revenue_per_event
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 5) ?? []}
                  layout="vertical"
                  margin={{ left: 20, right: 20 }}
                >
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" dataKey="revenue" tickFormatter={(value) => `₹ ${value / 1000}k`} />
                  <YAxis type="category" dataKey="event_name" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          {/* <Card>
            <CardHeader>
              <CardTitle>Revenue by Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={Object.fromEntries(
                  revenueSummary?.revenue_per_organizer.map((organizer, i) => [
                    organizer.organizer_name, // Key is "Organizer Name"
                    {
                      label: organizer.organizer_name,
                      color: `var(--chart-${(i % 5) + 1})`, // Use existing chart variables
                    },
                  ]) ?? []
                )}
                className="h-80"
              >
                <PieChart>
                  <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                  <Pie
                    data={revenueSummary?.revenue_per_organizer ?? []}
                    dataKey="revenue"
                    nameKey="organizer_name"
                    cy="50%"
                    cx="50%"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {revenueSummary?.revenue_per_organizer.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        // Use the dataKey/nameKey to match the config
                        fill={`var(--color-${entry.organizer_name})`}
                      />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card> */}
        </>}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? <Skeleton className="h-80" /> : <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              revenue: {
                label: "Revenue",
                color: "var(--color-chart-1)",
              },
            }} className="h-80">
              <AreaChart
                data={revenueSummary?.revenue_per_date ?? []}
                margin={{ left: 12, right: 12 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="revenue_date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis tickFormatter={(value) => `₹ ${value / 1000}k`} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3', fill: "hsl(var(--muted))" }}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="revenue"
                  type="natural"
                  fill="url(#colorRevenue)"
                  stroke="var(--color-revenue)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>}
      </div>
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? <Skeleton className="h-96" /> : <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Event Name</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueSummary?.revenue_per_event
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((event, index) => (
                    <TableRow key={event.event_id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{event.event_name}</TableCell>
                      <TableCell className="text-right">
                        {`₹ ${event.revenue.toLocaleString()}`}
                      </TableCell>
                      <TableCell className="text-right">
                        {`${((event.revenue / (revenueSummary?.total_revenue ?? 1)) * 100).toFixed(2)}%`}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>}
      </div>
    </div>
  );
}
