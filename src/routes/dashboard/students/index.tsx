import { createFileRoute } from "@tanstack/react-router";
import WorkInProgressPage from "../wip";
import { RestrictedAccess } from "@/components/restricted-access";

export const Route = createFileRoute("/dashboard/students/")({
  component: StudentsOverviewPage,
});

function StudentsOverviewPage() {
    const { user: sessionUser } = Route.useRouteContext();

    if (sessionUser.email === "finance@amrita.edu") {
        return <RestrictedAccess />;
    }
  return WorkInProgressPage();
}
