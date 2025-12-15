import { createFileRoute } from "@tanstack/react-router";
import WorkInProgressPage from "../wip";

export const Route = createFileRoute("/dashboard/students/")({
  component: StudentsOverviewPage,
});

function StudentsOverviewPage() {
  return WorkInProgressPage();
}
