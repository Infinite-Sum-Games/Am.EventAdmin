import { createFileRoute } from "@tanstack/react-router";
import WorkInProgressPage from "../wip";
import { RestrictedAccess } from "@/components/restricted-access";

export const Route = createFileRoute("/dashboard/students/")({
  component: StudentsOverviewPage,
});

function StudentsOverviewPage() {
    const { user: sessionUser } = Route.useRouteContext();

    const restrictedEmails = ["finance@amrita.edu", "pnr@amrita.edu"];

    if (restrictedEmails.includes(sessionUser.email)) {
        return <RestrictedAccess />;
    }
  return WorkInProgressPage();
}
