import { useState } from "react";
import {
  Gavel,
  Loader2,
  Mail,
  MessageSquare,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import type { Dispute } from "@/types/disputes";
import { DisputeDescriptionDialog } from "./dispute-description-dialog";

// ... (interface definition remains the same)
interface DisputeCardProps {
  dispute: Dispute;
  onResolve: (id: string) => void;
  isResolving: boolean;
  onEdit: (dispute: Dispute) => void;
}


export function DisputeCard({
  dispute,
  onResolve,
  isResolving,
  onEdit,
}: DisputeCardProps) {
  const status = dispute.dispute_status.dispute_status_enum;
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const description = dispute.description || "";
  const isLongDescription = description.length > 120;


  const renderStatusAction = () => {
    switch (status) {
      case "OPEN":
        return (
          <div className="flex flex-row lg:flex-col gap-2 w-full">
            <Button
              size="sm"
              variant="secondary"
              className="w-full shadow-sm"
              onClick={() => onEdit(dispute)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              className="w-full shadow-sm"
              onClick={() => onResolve(dispute.id)}
              disabled={isResolving}
            >
              {isResolving ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" /> Resolving...
                </>
              ) : (
                "Resolve"
              )}
            </Button>
          </div>
        );
      case "CLOSED_AS_TRUE":
        return (
          <div className="flex items-center justify-center w-full px-4 h-9 rounded-md text-green-100 border border-green-500/80 bg-green-500/10 font-medium text-sm">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            RESOLVED
          </div>
        );
      case "CLOSED_AS_FALSE":
        return (
          <div className="flex items-center justify-center w-full px-4 h-9 rounded-md text-red-100 border border-red-500/80 bg-red-500/10 font-medium text-sm">
            <XCircle className="w-4 h-4 mr-2" />
            REJECTED
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200 border-muted p-0">
        <CardContent className="py-3 px-4 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Left: Identifiers */}
          <div className="flex-1 max-w-full lg:max-w-[400px] space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-muted-foreground" />
                  {status === "OPEN" ? "Open " : status === "CLOSED_AS_TRUE" ? "Resolved " : status === "CLOSED_AS_FALSE" ? "Rejected " : ""}
                   Dispute
                </h3>
            </div>
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex items-center gap-2 text-xs group w-fit text-foreground">
                <span className="font-mono bg-muted/50 px-1.5 py-0.5 rounded border">
                  {dispute.txn_id}
                </span>
              </div>
              <div className="text-xs text-muted-foreground font-mono pl-1">
                Event: {dispute.event_id}
              </div>
            </div>
          </div>

          {/* Middle: Description & Contact */}
          <div className="w-full lg:flex-1 flex flex-col gap-3 border-t lg:border-t-0 lg:border-l lg:border-r pt-3 lg:pt-0 lg:px-6 min-w-0">
            <div className="flex gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-sm text-foreground/90 leading-snug">
                  {description ? (
                    <>
                      {isLongDescription
                        ? `${description.substring(0, 70)}... `
                        : description}
                      {isLongDescription && (
                        <button
                          onClick={() => setIsDescriptionOpen(true)}
                          className="text-primary hover:underline font-medium text-xs"
                        >
                          Read more
                        </button>
                      )}
                    </>
                  ) : (
                    <span className="text-muted-foreground italic">
                      No description provided
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              {dispute.student_email ? (
                <a
                  href={`mailto:${dispute.student_email}`}
                  className="hover:text-primary transition-colors hover:underline"
                >
                  {dispute.student_email}
                </a>
              ) : (
                <span className="text-muted-foreground italic">
                  No email linked
                </span>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="w-full lg:flex-[0.3] flex items-center justify-center lg:pl-4">
            {renderStatusAction()}
          </div>
        </CardContent>
      </Card>
      {isLongDescription && (
        <DisputeDescriptionDialog
          isOpen={isDescriptionOpen}
          onClose={() => setIsDescriptionOpen(false)}
          description={description}
        />
      )}
    </>
  );
}