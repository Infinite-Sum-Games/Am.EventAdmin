import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/revenue/transactions')({
  component: TransactionsPage,
});

function TransactionsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Transactions</h1>
      <p>This is a placeholder page for viewing all transactions.</p>
      <Link to="/dashboard/revenue" className="text-blue-500 underline mt-4 block">Back to Revenue Overview</Link>
    </div>
  );
}
