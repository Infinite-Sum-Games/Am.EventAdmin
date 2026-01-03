import { Copy, Gavel, Loader2, Mail, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import type { Dispute } from "@/types/disputes";

interface DisputeCardProps {
  dispute: Dispute;
  onResolve: (id: string) => void;
  isResolving: boolean;
  onEdit: (dispute: Dispute) => void;
}

export function DisputeCard({ dispute, onResolve, isResolving, onEdit }: DisputeCardProps) {
  const status = dispute.dispute_status.dispute_status_enum; 
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-muted p-0">
      <CardContent className="py-4 px-5 flex flex-col lg:flex-row gap-2 items-start lg:items-center justify-between">

        {/* Left: Identifiers */}
        <div className="flex-1 max-w-[400px] space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Gavel className="w-4 h-4 text-muted-foreground" /> {status === "OPEN" ? 'Open Dispute' : status === "RESOLVED" ? 'Resolved Dispute' : 'Rejected Dispute'}
            </h3>
          </div>

          <div className="flex flex-col gap-1.5 mt-1">
            {/* TXN ID */}
            <div
              className="flex items-center gap-2 text-xs text-muted-foreground group cursor-pointer w-fit hover:text-foreground transition-colors"
              title="Click to copy Transaction ID"
            >
              <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded border">
                {dispute.txn_id}
              </span>
              <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {/* Event ID (muted) */}
            <div className="text-xs text-muted-foreground font-mono pl-1">
              Event: {dispute.event_id}
            </div>
          </div>
        </div>

        {/* Middle: Description & Contact */}
        <div className="flex-1 flex flex-col gap-3 border-l-0 lg:border-l pl-0 lg:pl-6 min-w-0">

          {/* Description */}
          <div className="flex gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-sm text-foreground/90 leading-snug max-h-12 max-w-sm overflow-hidden text-ellipsis">
                {dispute.description || <span className="text-muted-foreground italic">No description provided </span>}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            {dispute.student_email ? (
              <a href={`mailto:${dispute.student_email}`} className="hover:text-primary transition-colors hover:underline">
                {dispute.student_email}
              </a>
            ) : (
              <span className="text-muted-foreground italic">No email linked</span>
            )}
          </div>
        </div>


        {/* Right: Actions */}
        <div className="w-full lg:w-auto flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 pl-0 lg:pl-6 min-w-[140px]">
          {/* Button to edit */}
          {status === "OPEN" && (
            <Button
              size="sm"
              variant="secondary"
              className="w-full lg:w-full shadow-sm"
              onClick={() => onEdit(dispute)}
            >
              Edit Dispute
            </Button>
          )}

          {/* Resolve Button (Only if OPEN) */}
          {status === "OPEN" && (
            <Button
              size="sm"
              className="w-full lg:w-full shadow-sm"
              onClick={() => onResolve(dispute.id)}
              disabled={isResolving}
            >
              {isResolving ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" /> Resolving...
                </>
              ) : (
                "Resolve Dispute"
              )}
            </Button>
          )}
        </div>

      </CardContent>
    </Card>
  );
}