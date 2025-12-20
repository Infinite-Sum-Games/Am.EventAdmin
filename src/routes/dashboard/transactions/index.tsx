import { useState, useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { axiosClient } from '@/lib/axios'
import type { GetAllTransactionsResponse, Transaction } from '@/types/transactions'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { TransactionCard } from '@/components/transaction-card'
import { ChevronLeft, ChevronRight, Loader2, FilterX } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/transactions/')({
  component: RouteComponent,
})

const ITEMS_PER_PAGE = 20;

function RouteComponent() {
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [currentPage, setCurrentPage] = useState(1);

  // Query to fetch all transactions
  const { data: transactions = [], isLoading, isError, refetch } = useQuery<GetAllTransactionsResponse>({
    queryKey: ['transactions', statusFilter],
    queryFn: async () => {
      const response = await axiosClient.get(api.FETCH_ALL_TRANSACTIONS, {
        params: {
          status: statusFilter
        }
      })
      return response.data.transactions;
    }
  });

  // Mutation to verify a transaction
    const { mutate: verifyTransaction, isPending: isVerifying } = useMutation({
      mutationKey: ['verify-transaction'],
      mutationFn: async (txnId: string) => {
        const response = await axiosClient.post(api.VERIFY_TRANSACTION, { txn_id: txnId });
        return response.data;
      },
      onSuccess: () => {
        toast.success("Transaction verified successfully");
        refetch();
      },
      onError: () => {
        toast.error("Failed to verify transaction");
      },
    });
  
  // verify transaction handler
  const handleVerifyTransaction = async (id: string) => {
    verifyTransaction(id);
  };

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return transactions.slice(start, start + ITEMS_PER_PAGE);
  }, [transactions, currentPage]);

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
        {!isLoading && !isError && currentData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/30">
            <FilterX className="w-12 h-12 mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">No transactions found</h3>
            <p className="text-sm">Try adjusting your status filter.</p>
          </div>
        )}

        {/* List of Cards */}
        {!isLoading && currentData.map((txn: Transaction) => (
          <TransactionCard 
            key={txn.transaction_id} 
            transaction={txn} 
            onVerify={handleVerifyTransaction}
            isVerifying={isVerifying}
          />
        ))}

        {/* --- Pagination Controls --- */}
        {!isLoading && currentData.length > 0 && (
          <div className="flex items-center justify-between py-4 border-t mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, transactions.length)} of {transactions.length} entries
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