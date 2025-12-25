import * as React from "react"
import { IndianRupee, Users, CalendarCheck, ClipboardList } from "lucide-react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import type { RevenueSummary, RegistrationSummary } from "@/types/analytics"
import { Skeleton } from "@/components/ui/skeleton"

interface SummaryStatsProps {
  revenueSummary: RevenueSummary | undefined
  registrationSummary: RegistrationSummary | undefined
  isLoading: boolean
}

function Stat({
  icon: Icon,
  label,
  value,
  isLoading,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  isLoading: boolean
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex flex-col">
        <p className="text-muted-foreground">{label}</p>
        {isLoading ? (
          <Skeleton className="h-7 w-24 mt-1" />
        ) : (
          <p className="text-2xl font-bold tracking-tighter">{value}</p>
        )}
      </div>
    </div>
  )
}

export function SummaryStats({
  revenueSummary,
  registrationSummary,
  isLoading,
}: SummaryStatsProps) {
  const totalRevenue = React.useMemo(() => {
    if (!revenueSummary) return 0
    return revenueSummary.total_revenue
  }, [revenueSummary])

  const eventsWithParticipants = React.useMemo(() => {
    if (!registrationSummary) return 0
    return registrationSummary.event_registration_stats.filter(
      (stat) => stat.registered_count > 0,
    ).length
  }, [registrationSummary])

  const organizersWithRevenue = React.useMemo(() => {
    if (!revenueSummary) return 0
    return revenueSummary.revenue_per_organizer.length
  }, [revenueSummary])

  const totalEventRegistrations = React.useMemo(() => {
    if (!registrationSummary) return 0
    return registrationSummary.total_event_registrations
  }, [registrationSummary])

  return (
    <Card>
      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat
          icon={IndianRupee}
          label="Total Revenue"
          value={totalRevenue.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          })}
          isLoading={isLoading}
        />
        <Stat
          icon={ClipboardList}
          label="Total Registrations"
          value={totalEventRegistrations}
          isLoading={isLoading}
        />
        <Stat
          icon={CalendarCheck}
          label="Events with Participants"
          value={eventsWithParticipants}
          isLoading={isLoading}
        />
        <Stat
          icon={Users}
          label="Active Organizers"
          value={organizersWithRevenue}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  )
}