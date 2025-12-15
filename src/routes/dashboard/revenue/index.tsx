import { createFileRoute, Link } from "@tanstack/react-router";
import WorkInProgressPage from "../wip";

export const Route = createFileRoute("/dashboard/revenue/")({
  component: RevenueOverviewPage,
});

function RevenueOverviewPage() {
  return WorkInProgressPage();
}
