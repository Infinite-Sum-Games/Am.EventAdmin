import { createFileRoute } from "@tanstack/react-router"
import WorkInProgressPage from "./wip";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardOverviewPage,
});

function DashboardOverviewPage() {
  return WorkInProgressPage()
}