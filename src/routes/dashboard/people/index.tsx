import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/people/')({
  component: PeoplePage,
});

function PeoplePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">People</h1>
      <p>This is a placeholder page for viewing all people.</p>
      <Link to="/dashboard/people/new" className="text-blue-500 underline mt-4 block">Go to New Person page</Link>
    </div>
  );
}
