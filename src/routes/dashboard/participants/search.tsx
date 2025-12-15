import { createFileRoute } from "@tanstack/react-router";
import WorkInProgressPage from "../wip";

export const Route = createFileRoute("/dashboard/participants/search")({
  component: ParticipantsSearchPage,
});

function ParticipantsSearchPage() {
  return WorkInProgressPage();
}
