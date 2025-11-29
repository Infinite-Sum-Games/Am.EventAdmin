import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/students/')({
  component: StudentsOverviewPage,
});

function StudentsOverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Students Overview</h1>
      <p>This is a placeholder page for analytics on registered students.</p>
    </div>
  );
}
