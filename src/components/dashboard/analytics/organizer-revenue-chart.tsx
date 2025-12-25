import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { RevenuePerOrganizer } from "@/types/analytics"

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
]

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

export function OrganizerRevenueChart({
  data,
}: {
  data: RevenuePerOrganizer[] | undefined
}) {
  if (!data) {
    return <div>Loading...</div>
  }

  const processedData = React.useMemo(() => {
    if (!data) return []
    const sortedData = [...data].sort((a, b) => b.revenue - a.revenue)
    const top5 = sortedData.slice(0, 5)
    const others = sortedData.slice(5)

    let chartData = top5

    if (others.length > 0) {
      const othersRevenue = others.reduce((acc, curr) => acc + curr.revenue, 0)
      chartData = [
        ...top5,
        {
          organizer_name: "Others",
          revenue: othersRevenue,
          organizer_id: "others",
        },
      ]
    }

    return chartData.map((d) => ({ ...d, slug: slugify(d.organizer_name) }))
  }, [data])

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {}
    processedData.forEach((item, index) => {
      config[item.slug] = {
        label: item.organizer_name,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }
    })
    return config
  }, [processedData])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Organizer</CardTitle>
        <CardDescription>
          Top 5 organizers by revenue contribution.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-96"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  nameKey="slug"
                  className="w-[200px]"
                />
              }
            />
            <Pie
              data={processedData}
              dataKey="revenue"
              nameKey="slug"
              innerRadius="40%"
              strokeWidth={4}
              cy="50%"
            >
              {processedData.map((entry) => (
                <Cell key={entry.slug} fill={`var(--color-${entry.slug})`} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="slug" />}
              className="-translate-y-2 md:grid md:grid-cols-3 lg:flex gap-2 sm:mt-4 mt-0 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}