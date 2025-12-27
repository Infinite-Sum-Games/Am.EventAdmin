import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface DisputeDialogProps {
    transactionId: string;
    isOpen: boolean;
    onClose: () => void;
    onCreateDispute: (transactionId: string) => void;
}

export function DisputeDialog({
    transactionId,
    isOpen,
    onClose,
    onCreateDispute,
}: DisputeDialogProps) {
    const [inputValue, setInputValue] = useState("");

    const handleCreateDispute = () => {
        if (inputValue === transactionId.slice(-4)) {
            onCreateDispute(transactionId);
            toast.success("Dispute created successfully!");
            onClose();
        } else {
            toast.error("The last 4 characters of the transaction ID do not match.");
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Create Dispute</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please enter the last 4 characters of the transaction ID to confirm.
                        <br />
                        (Get the last <span className="font-semibold text-white">4 characters</span> from the <span className="font-semibold text-white">PayU confirmation email</span>)
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    maxLength={4}
                    placeholder="Last 4 characters"
                />
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCreateDispute}>
                        Create Dispute
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
