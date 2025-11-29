import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/revenue/')({
  component: RevenueOverviewPage,
});

function RevenueOverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Revenue Overview</h1>
      <p>This is a placeholder for the revenue overview dashboard.</p>
      <Link to="/dashboard/revenue/transactions" className="text-blue-500 underline mt-4 block">Go to Transactions</Link>
    </div>
  );
}
