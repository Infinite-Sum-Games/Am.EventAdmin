import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DisputeDescriptionDialogProps {
  description: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DisputeDescriptionDialog({ description, isOpen, onClose }: DisputeDescriptionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Full Dispute Description</DialogTitle>
        </DialogHeader>
        <div className="mt-4 text-sm text-muted-foreground max-h-[60vh] overflow-y-auto pr-4">
          {description}
        </div>
      </DialogContent>
    </Dialog>
  );
}
