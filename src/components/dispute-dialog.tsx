import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Dispute } from "@/types/disputes";
import { updateDisputeSchema, type UpdateDisputeForm } from "@/schemas/disputes";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface DisputeDialogProps {
  dispute: Dispute;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (values: UpdateDisputeForm) => void;
  isUpdating?: boolean;
  readOnly?: boolean;
}

export function DisputeDialog({
  dispute,
  isOpen,
  onClose,
  onSubmit,
  isUpdating,
  readOnly = false,
}: DisputeDialogProps) {
  const form = useForm<UpdateDisputeForm>({
    resolver: zodResolver(updateDisputeSchema),
    defaultValues: {
      student_email: dispute.student_email || "",
      description: dispute.description || "",
    },
  });

  useEffect(() => {
    form.reset({
      student_email: dispute.student_email || "",
      description: dispute.description || "",
    });
  }, [dispute, form]);

  const handleFormSubmit = (values: UpdateDisputeForm) => {
    onSubmit?.(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {readOnly ? "Dispute Details" : "Edit Dispute"}
          </DialogTitle>
          {!readOnly && (
            <DialogDescription>
              Update the student's email or the description of the dispute.
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="student_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="student@email.com"
                      {...field}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the issue..."
                      {...field}
                      disabled={readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isUpdating}
              >
                {readOnly ? "Close" : "Cancel"}
              </Button>
              {!readOnly && (
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Save Changes
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
