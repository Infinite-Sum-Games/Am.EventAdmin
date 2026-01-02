import { useState, useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { axiosClient } from '@/lib/axios'
import type { Transaction } from '@/types/transactions'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { TransactionCard } from '@/components/transaction-card'
import { ChevronLeft, ChevronRight, Loader2, FilterX, Wallet, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

import { RestrictedAccess } from '@/components/restricted-access';

export const Route = createFileRoute('/dashboard/transactions/')({
  component: RouteComponent,
})

const ITEMS_PER_PAGE = 20;

function RouteComponent() {
  const { user: sessionUser } = Route.useRouteContext();

  const restrictedEmails = ["finance@amrita.edu", "pnr@amrita.edu"];

  if (restrictedEmails.includes(sessionUser.email)) {
    return <RestrictedAccess />;
  }

  if (sessionUser.email != "kiran@amrita.edu") {
    return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto min-h-screen">
      
      {/* Header (Optional - kept for context) */}
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">Manage and verify payments.</p>
      </div>

      {/* Main Content: Coming Soon State */}
      <div className="flex flex-col items-center justify-center flex-1 min-h-[50vh]">
        <div className="flex flex-col items-center justify-center bg-muted/30 border-2 border-dashed border-muted rounded-xl py-16 px-6 max-w-md w-full text-center">
            
            {/* Animated Icon */}
            <div className="relative bg-background p-4 rounded-full mb-6 shadow-sm ring-1 ring-border">
                <Clock className="absolute -right-1 -top-1 w-5 h-5 text-blue-500 animate-pulse" />
                <Wallet className="w-8 h-8 text-muted-foreground" />
            </div>

            <h3 className="text-xl font-semibold tracking-tight">
                Transactions Page will be back soon!
            </h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-xs">
                We are currently updating the transaction management system. This feature will be back shortly.
            </p>

            <Button asChild variant="outline">
                <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
        </div>
      </div>

    </div>
  )
  }

  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [emailSearch, setEmailSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: transactions = [], isLoading, isError, refetch } = useQuery<Transaction[]>({
    queryKey: ['transactions', statusFilter],
    queryFn: async () => {
      const response = await axiosClient.get(api.FETCH_ALL_TRANSACTIONS, {
        params: {
          status: statusFilter
        }
      })
      return response.data.transactions || [];
    }
  });

  // Mutation to verify a transaction
    const { mutate: verifyTransaction, isPending: isVerifying, variables: verifyingTxnId } = useMutation({
      mutationKey: ['verify-transaction'],
      mutationFn: async (txnId: string) => {
        const response = await axiosClient.post(api.VERIFY_TRANSACTION, { txn_id: txnId });
        return response.data;
      },
      // it will return message and status
      onSuccess: (data) => {
        toast.success("Transaction status updated to " + data.status);
        refetch();
      },
      onError: () => {
        toast.error("Failed to update transaction status. Please try again.");
      },
    });
  
  // verify transaction handler
  const handleVerifyTransaction = async (id: string) => {
    verifyTransaction(id);
  };

  // filter email search
  const filteredTransactions = useMemo(() => {
    const safeTransactions = transactions || [];
    if (!emailSearch) return safeTransactions;
    return safeTransactions.filter((txn: Transaction) => 
      txn.email.toLowerCase().includes(emailSearch.toLowerCase())
    );
  }, [transactions, emailSearch]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return (filteredTransactions || []).slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const handleFilterChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex flex-row gap-4 justify-between items-center border-b pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
             Manage and verify event registrations. 
          </p>
        </div>
        

        <div className="flex items-center gap-3">
          {/* Search bar for email */}
          <Input
            type="text"
            placeholder="Search by email"
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
            </Select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p>Loading transactions...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="p-8 text-center bg-destructive/5 rounded-lg border border-destructive/20">
             <p className="text-destructive font-semibold">Failed to load transactions.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/30">
            <FilterX className="w-12 h-12 mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">No pending transactions left</h3>
            <p className="text-sm">No more pending transactions to display</p>
          </div>
        )}

        {/* Filtered Empty State */}
        {!isLoading && !isError && transactions.length > 0 && currentData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/30">
            <FilterX className="w-12 h-12 mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">No transactions found</h3>
            <p className="text-sm">Try adjusting your email or status filter.</p>
          </div>
        )}

        {/* List of Cards */}
        {!isLoading && currentData.map((txn: Transaction) => (
          <TransactionCard 
            key={txn.transaction_id} 
            transaction={txn} 
            onVerify={handleVerifyTransaction}
            isVerifying={isVerifying && verifyingTxnId === txn.transaction_id}
          />
        ))}

        {/* Pagination Controls*/}
        {!isLoading && currentData.length > 0 && (
          <div className="flex items-center justify-between py-4 border-t mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length} entries
            </p>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToPrevPage} 
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <span className="text-sm font-medium px-2">
                 Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToNextPage} 
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}