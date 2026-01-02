import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { axiosClient } from "@/lib/axios"
import type {
    GetRevenueSummaryResponse,
    GetRegistrationSummaryResponse,
    GetPeopleRegistrationSummaryResponse,
    GetTransactionSummaryResponse,
} from "@/types/analytics"
import { RevenueChart } from "@/components/dashboard/analytics/revenue-chart"
import { OrganizerRevenueChart } from "@/components/dashboard/analytics/organizer-revenue-chart"
import { SummaryStats } from "@/components/dashboard/analytics/summary-stats"
import { ParticipantSplitChart } from "@/components/dashboard/analytics/participant-split-chart"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { TriangleAlert } from "lucide-react"

import { RestrictedAccess } from "@/components/restricted-access"

export const Route = createFileRoute("/dashboard/analytics/")({
    component: AnalyticsPage,
})

function AnalyticsPage() {
    const { user: sessionUser } = Route.useRouteContext();

    if (sessionUser.email === "finance@amrita.edu") {
        return <RestrictedAccess />;
    }

    const showWarning = false; // Set to true to show the warning, false to hide it

    const {
        data: revenueSummary,
        isLoading: isRevenueLoading,
        isError: isRevenueError,
    } = useQuery({
        queryKey: ["revenueSummary"],
        queryFn: async () => {
            const response = await axiosClient.get<GetRevenueSummaryResponse>(
                api.REVENUE_SUMMARY,
            )
            return response.data.revenue_summary
        },
    })

    const {
        data: registrationSummary,
        isLoading: isRegistrationLoading,
        isError: isRegistrationError,
    } = useQuery({
        queryKey: ["registrationSummary"],
        queryFn: async () => {
            const response =
                await axiosClient.get<GetRegistrationSummaryResponse>(
                    api.REGISTRATIONS_SUMMARY,
                )
            return response.data.registration_summary
        },
    })

    const {
        data: peopleRegistrationSummary,
        isLoading: isPeopleLoading,
        isError: isPeopleError,
    } = useQuery({
        queryKey: ["peopleRegistrationSummary"],
        queryFn: async () => {
            const response =
                await axiosClient.get<GetPeopleRegistrationSummaryResponse>(
                    api.PEOPLE_REGISTRATION_SUMMARY,
                )
            return response.data.people_registration_summary
        },
    })

    const {
        data: transactionSummary,
        isLoading: isTransactionLoading,
        isError: isTransactionError,
    } = useQuery({
        queryKey: ["transactionSummary"],
        queryFn: async () => {
            const response =
                await axiosClient.get<GetTransactionSummaryResponse>(
                    api.TRANSACTION_SUMMARY,
                )
            return response.data.transaction_summary
        },
    })

    console.log(transactionSummary)

    const isLoading =
        isRevenueLoading ||
        isRegistrationLoading ||
        isPeopleLoading ||
        isTransactionLoading

    const isError =
        isRevenueError ||
        isRegistrationError ||
        isPeopleError ||
        isTransactionError

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 p-4 max-w-7xl mx-auto h-full items-center justify-center">
                <h1 className="text-3xl font-bold tracking-tight">Loading Analytics...</h1>
                <p className="text-muted-foreground">Please wait while we fetch the data.</p>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col gap-4 p-4 max-w-7xl mx-auto h-full items-center justify-center text-destructive">
                <h1 className="text-3xl font-bold tracking-tight">Error Loading Analytics</h1>
                <p className="text-muted-foreground">There was an error fetching the analytics data. Please try again later.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 p-4 max-w-7xl mx-auto">
            <div className="flex flex-row gap-4 items-center justify-between border-b pb-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-muted-foreground">
                        Overview of platform analytics and statistics
                    </p>
                </div>
            </div>

            {showWarning && (
                <Alert variant="destructive">
                    <TriangleAlert className="h-4 w-4" />
                    <AlertTitle>Analytics is broken</AlertTitle>
                    <AlertDescription>
                        The analytics page is currently broken and will be fixed as soon as possible.
                    </AlertDescription>
                </Alert>
            )}

            <SummaryStats
                revenueSummary={revenueSummary}
                registrationSummary={registrationSummary}
                isLoading={isLoading}
            />
            <RevenueChart data={revenueSummary?.revenue_per_date} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <OrganizerRevenueChart data={revenueSummary?.revenue_per_organizer} />
                <ParticipantSplitChart
                  data={registrationSummary?.participant_split}
                  peopleData={peopleRegistrationSummary}
                />
            </div>
        </div>
    )
}
