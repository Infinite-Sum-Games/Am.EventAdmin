import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/participants/')({
  component: ParticipantsOverviewPage,
});

function ParticipantsOverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Participants Overview</h1>
      <p>This is a placeholder page for participants overview (e.g., by event).</p>
      <Link to="/dashboard/participants/search" className="text-blue-500 underline mt-4 block">Search All Participants</Link>
    </div>
  );
}
