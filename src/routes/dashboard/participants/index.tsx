import { createFileRoute, Link } from "@tanstack/react-router";
import WorkInProgressPage from "../wip";

export const Route = createFileRoute("/dashboard/participants/")({
  component: ParticipantsOverviewPage,
});

function ParticipantsOverviewPage() {
  return WorkInProgressPage();
}
