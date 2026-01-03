import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios';
import { api } from '@/lib/api';
import { 
  Loader2,
  FilterX,
} from "lucide-react";
import { toast } from "sonner";
import type { Dispute, GetDisputesResponse } from '@/types/disputes';
import { DisputeCard } from '@/components/dispute-card';
import { useState } from 'react';
import { DisputeDialog } from '@/components/dispute-dialog';
import type { UpdateDisputeForm } from '@/schemas/disputes';


export const Route = createFileRoute('/dashboard/disputes/')({
  component: RouteComponent,
});


function RouteComponent() {
  const queryClient = useQueryClient();
  const [editingDispute, setEditingDispute] = useState<Dispute | null>(null);

  const { data: disputes = [], isLoading, isError } = useQuery<Dispute[]>({
    queryKey: ['disputes'],
    queryFn: async () => {
      const response = await axiosClient.get<GetDisputesResponse>(api.GET_DISPUTES);
      return response.data.disputes; 
    }
  });

  // resolve mutation
  const { mutate: resolveDispute, isPending: isResolving } = useMutation({
    mutationFn: async (txn_id: string) => {
      const response = await axiosClient.post(api.RESOLVE_DISPUTE, { txn_id: txn_id });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Dispute marked as resolved");
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
    },
    onError: () => {
      toast.error("Failed to resolve dispute");
    }
  });

  const { mutate: updateDispute, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: UpdateDisputeForm }) => {
      const response = await axiosClient.post(api.UPDATE_DISPUTE(id), values);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Dispute updated successfully");
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      setEditingDispute(null);
    },
    onError: () => {
      toast.error("Failed to update dispute");
    },
  });

  const handleEditSubmit = (values: UpdateDisputeForm) => {
    if (editingDispute) {
      updateDispute({ id: editingDispute.txn_id, values });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 md:items-end justify-between border-b pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Disputes</h1>
          <p className="text-muted-foreground">
             Manage and resolve issues reported against transactions.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        
        {/* Loading State */}
        {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                <p>Loading disputes...</p>
            </div>
        )}

        {/* Error State */}
        {isError && (
            <div className="p-8 text-center bg-destructive/5 rounded-lg border border-destructive/20">
                <p className="text-destructive font-semibold">Failed to load disputes.</p>
            </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && disputes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/10">
                <div className="bg-muted p-4 rounded-full mb-4">
                    <FilterX className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No disputes found</h3>
                <p className="text-sm mt-1 max-w-xs text-center">
                    Great news! There are currently no disputes raised against your events.
                </p>
            </div>
        )}

        {/* Disputes List */}
        {!isLoading && disputes.map((dispute) => (
            <DisputeCard 
                key={dispute.id} 
                dispute={dispute} 
                onResolve={(id) => resolveDispute(id)}
                isResolving={isResolving}
                onEdit={setEditingDispute}
            />
        ))}

        {editingDispute && (
          <DisputeDialog
            isOpen={!!editingDispute}
            onClose={() => setEditingDispute(null)}
            dispute={editingDispute}
            onSubmit={handleEditSubmit}
            isUpdating={isUpdating}
          />
        )}
      </div>
    </div>
  );
}