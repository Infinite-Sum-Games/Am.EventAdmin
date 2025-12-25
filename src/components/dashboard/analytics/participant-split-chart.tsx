"use client"

import { RadialBar, RadialBarChart, PolarGrid, PolarRadiusAxis, Label } from "recharts"
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
import type { RegistrationSummary, PeopleRegistrationSummary } from "@/types/analytics"

const chartConfig = {
  participants: {
    label: "Participants",
    color: "var(--chart-1)",
  },
  non_participants: {
    label: "Non-Participants",
    color: "var(--chart-2)",
  },
  internal: {
    label: "Internal",
    color: "var(--chart-6)",
  },
  external: {
    label: "External",
    color: "var(--chart-7)",
  },
} satisfies ChartConfig

export function ParticipantSplitChart({
  data,
  peopleData,
}: {
  data: RegistrationSummary["participant_split"] | undefined
  peopleData: PeopleRegistrationSummary | undefined
}) {
  if (!data || !peopleData) {
    return <div>Loading...</div>
  }

  const chartData = [{ 
    ...data, 
    ...peopleData.website_registration_split,
    name: "split" 
  }]
  const totalWebsiteRegistrations = peopleData.total_website_registrations

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Registrations Breakdown</CardTitle>
        <CardDescription>
          A breakdown of event participants and website registrations.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          // Increased max height slightly to give it room to grow
          className="mx-auto aspect-square max-h-[350px]"
        >
          <RadialBarChart
            data={chartData}
            // Increased barSize
            barSize={24}
            innerRadius="70%" 
            outerRadius="110%"
            startAngle={90}
            endAngle={450}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {totalWebsiteRegistrations.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-xs"
                        >
                          Total Registrations
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>

            {/* Outer Ring: Participants - Pushed to the edge */}
            <RadialBar
              dataKey="participants"
              fill="var(--color-participants)"
              stackId="a"
              cornerRadius={10}
              className="stroke-transparent stroke-2"
              name="Participants"
            />
            <RadialBar
              dataKey="non_participants"
              fill="var(--color-non_participants)"
              stackId="a"
              name="Non Participants"
              cornerRadius={10}
              className="stroke-transparent stroke-2"
            />

            <RadialBar
              dataKey="internal"
              fill="var(--color-internal)"
              stackId="b"
              cornerRadius={10}
              className="stroke-transparent stroke-2"
              // Moved out to fill the gap
              name="Amrita Students"
            />
            <RadialBar
              dataKey="external"
              fill="var(--color-external)"
              stackId="b"
              cornerRadius={10}
              className="stroke-transparent stroke-2"
              name="Non Amrita Students"
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel className="w-[200px]" />}
            />
            <ChartLegend
              content={<ChartLegendContent />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}