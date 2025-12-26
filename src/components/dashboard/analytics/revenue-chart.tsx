import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { RevenuePerDate } from "@/types/analytics"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
}

export function RevenueChart({
  data,
}: {
  data: RevenuePerDate[] | undefined
}) {
  if (!data) {
    return <div>Loading...</div>
  }

  const formattedData = data.map((item) => ({
    ...item,
    revenue_date: new Date(item.revenue_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Analytics</CardTitle>
        <CardDescription>
          A summary of the revenue generated over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-108 w-full">
          <AreaChart
            accessibilityLayer
            data={formattedData}
            margin={{
              top: 12,
              bottom: 12,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="revenue_date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (typeof value === "number") {
                  return `₹${value}` 
                }
                return value
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}