import { createFileRoute } from "@tanstack/react-router";
import {
  queryOptions,
  useSuspenseQuery,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Binoculars,
  Trash2,
  Edit3,
  Building,
  Users,
  Plus,
  Lock,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Organizer, OrganizerType } from "@/types/organizers";
import { NewOrgForm } from "@/components/orgs/new-org-form";
import type { GetAllOrganizersResponse } from "@/types/organizers";
import { EditOrgForm } from "@/components/orgs/edit-org-form";
import { axiosClient } from "@/lib/axios";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { hashPassword } from "@/lib/hash";
import { ErrorMessage } from "@/components/events/error-message";

const orgsQueryOptions = queryOptions({
  queryKey: ["orgs"],
  queryFn: async () => {
    const res = await axiosClient.get<GetAllOrganizersResponse>(
      api.FETCH_ALL_ORGANIZERS
    );
    return res.data.organizers;
  },
});

export const Route = createFileRoute("/dashboard/orgs/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(orgsQueryOptions),
  component: OrgsPage,
});

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

function OrgsPage() {
  const queryClient = useQueryClient();
  const { data: orgs } = useSuspenseQuery(orgsQueryOptions);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editOrg, setEditOrg] = useState<Organizer | null>(null);
  const [isUpdatePasswordDialogOpen, setIsUpdatePasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [typeFilter, setTypeFilter] = useState<OrganizerType | "ALL">("ALL");

  const filteredOrgs = useMemo(() => {
    if (typeFilter === "ALL") return orgs;
    return orgs.filter((org) => org.org_type === typeFilter);
  }, [orgs, typeFilter]);

  const { mutate: deleteOrg } = useMutation({
    mutationFn: async (orgId: string) => {
      await axiosClient.delete(api.DELETE_ORGANIZER(orgId));
    },
    onSuccess: () => {
      toast.success("Organizer deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
    },
    onError: () => {
      toast.error("Failed to delete organizer. This organizer might be linked to existing events.");
    },
  });

  const { mutate: updateOrgPassword, error: updateOrgPasswordError } = useMutation({
    mutationFn: async ({ orgId, newPassword }: { orgId: string; newPassword: string }) => {
      const hashedPassword = await hashPassword(newPassword);
      await axiosClient.put(api.UPDATE_ORGANIZER_PASSWORD(orgId), { password: hashedPassword });
    },
    onSuccess: () => {
      toast.success("Organizer password updated successfully");
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
      setNewPassword("");
      setConfirmPassword("");
      setIsUpdatePasswordDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to update organizer password");
    },
  });

  const handleDelete = () => {
    if (editOrg) {
      deleteOrg(editOrg.id);
      setIsDeleteDialogOpen(false);
    }
  }

  const handlePasswordUpdate = () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!editOrg) return;
    updateOrgPassword({ orgId: editOrg.id, newPassword });
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-7xl mx-auto">
      <div className="flex flex-row gap-4 items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Organizers</h1>
          <p className="text-muted-foreground">Add new organizers to manage your events.</p>
        </div>

        <div className="flex flex-row items-center gap-2 ">
          <Select
            value={typeFilter}
            onValueChange={(value) =>
              setTypeFilter(value as OrganizerType | "ALL")
            }
          >
            <SelectTrigger className="w-[180px] mr-2">
              <SelectValue placeholder="Filter by type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Organizers</SelectItem>
              <SelectItem value="DEPARTMENT">Department</SelectItem>
              <SelectItem value="CLUB">Club</SelectItem>
            </SelectContent>
          </Select>

          {/* Create Organizer Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-auto flex items-center cursor-pointer">
                <Plus className="h-4 w-4" />Create Organizer
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Organizer</DialogTitle>
              </DialogHeader>

              <NewOrgForm
                onSuccess={() => {
                  toast.success("Organizer created successfully");
                  setIsDialogOpen(false);
                  queryClient.invalidateQueries({ queryKey: ["orgs"] });
                }}
              />
            </DialogContent>
          </Dialog>

        </div>
      </div>

      {/* Organizers */}
      {!filteredOrgs || filteredOrgs.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-muted/30 border border-muted rounded-lg py-12 mt-4">
          <div className="bg-background p-4 rounded-full mb-4">
            <Binoculars className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No organizers found</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4 text-center max-w-sm">
            You haven't created any organizers yet. Click the button above to get started.
          </p>
        </div>
      ) : (
        <Card className="py-0 mt-1">
          <div className="flex flex-col">
            {filteredOrgs.map((org, index) => (
              <div key={org.id}>
                <div className="flex items-center gap-4 p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {getInitials(org.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid gap-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{org.name}</p>

                      <Badge>
                        {org.org_type === "DEPARTMENT" ? (
                          <Building className="mr-1 h-3 w-3" />
                        ) : (
                          <Users className="mr-1 h-3 w-3" />
                        )}
                        {org.org_type}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Student Head: {org.student_head}
                    </p>
                  </div>

                  <div className="flex gap-2">

                    {/* Edit Organizer Dialog */}
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button type="button" onClick={() => setEditOrg(org)} className="flex items-center cursor-pointer">
                          <Edit3 className="h-4 w-4" />Edit
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Organizer</DialogTitle>
                        </DialogHeader>

                        {editOrg && editOrg.email && editOrg.student_head && editOrg.faculty_head && (
                          <EditOrgForm
                            organizer={{
                              ...editOrg,
                              email: editOrg.email,
                              student_head: editOrg.student_head,
                              faculty_head: editOrg.faculty_head,
                              student_co_head: editOrg.student_co_head ?? undefined,
                            }}
                            onSuccess={() => {
                              toast.success("Organizer edited successfully");
                              setIsEditDialogOpen(false);
                              queryClient.invalidateQueries({
                                queryKey: ["orgs"],
                              });
                            }}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button variant={"default"} className="flex items-center cursor-pointer" onClick={() => {
                      setEditOrg(org);
                      setIsUpdatePasswordDialogOpen(true);
                    }}>

                      <Lock className="w-5 h-5" />Reset Password
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        setEditOrg(org);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="flex items-center cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5" />Delete
                    </Button>
                  </div>
                </div>

                {index < filteredOrgs.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </Card>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Organizer?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the organizer and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 cursor-pointer"
            >
              Delete Organizer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Password Dialog */}
      <Dialog
        open={isUpdatePasswordDialogOpen}
        onOpenChange={(open) => {
          setIsUpdatePasswordDialogOpen(open);
          if (!open) {
            // Reset fields when closing
            setNewPassword("");
            setConfirmPassword("");
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Password</DialogTitle>
            <DialogDescription>
              Enter a new password for <span className="font-semibold">{editOrg?.name}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <ErrorMessage
            title="Cant Update Password"
            message={updateOrgPasswordError?.message}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdatePasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePasswordUpdate}
              disabled={!newPassword || !confirmPassword}
            >
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
