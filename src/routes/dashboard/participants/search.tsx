import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/participants/search')({
  component: ParticipantsSearchPage,
});

function ParticipantsSearchPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Search Participants</h1>
      <p>This is a placeholder page for searching all participants.</p>
      <Link to="/dashboard/participants" className="text-blue-500 underline mt-4 block">Back to Participants Overview</Link>
    </div>
  );
}
