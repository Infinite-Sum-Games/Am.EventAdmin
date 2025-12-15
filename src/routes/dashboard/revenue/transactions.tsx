import { createFileRoute, Link } from "@tanstack/react-router";
import WorkInProgressPage from "../wip";

export const Route = createFileRoute("/dashboard/revenue/transactions")({
  component: TransactionsPage,
});

function TransactionsPage() {
  return WorkInProgressPage();
}
