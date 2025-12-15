import { api } from "@/lib/api";
import { axiosClient } from "@/lib/axios";
import { updateOrganizerSchema, type UpdateOrganizerInput } from "@/schemas/orgs";
import type { Organizer } from "@/types/organizers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Building2, 
  Mail, 
  User, 
  GraduationCap, 
  Loader2, 
  Save,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ErrorMessage } from "../events/error-message";

export function EditOrgForm({ organizer, onSuccess }: { organizer: UpdateOrganizerInput; onSuccess: () => void }) {
  const [name, setName] = useState(organizer.name);
  const [email, setEmail] = useState(organizer.email);
  const [orgType, setOrgType] = useState<Organizer["org_type"]>(organizer.org_type);
  const [facultyHead, setFacultyHead] = useState(organizer.faculty_head);
  const [studentHead, setStudentHead] = useState(organizer.student_head);
  const [studentCoHead, setStudentCoHead] = useState(organizer.student_co_head);

  const queryClient = useQueryClient();

  const { mutate: updateOrganizer, isPending, error } = useMutation({
    mutationFn: async (payload: UpdateOrganizerInput) => {
      // zod validation
      const validatedData = updateOrganizerSchema.safeParse(payload);
      if (!validatedData.success) {
        const errorMessages = validatedData.error.issues.map(issue => issue.message).join("\n");
        throw new Error(errorMessages);
      }

      const response = await axiosClient.put(api.UPDATE_ORGANIZER(payload.id), validatedData.data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Updated organizer successfully!");
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
      onSuccess();
    },
    onError: () => {
      toast.error("Error updating organizer");
    },
  });

  const handleSubmit = () => {
    updateOrganizer({
      id: organizer.id,
      name,
      email,
      org_type: orgType,
      faculty_head: facultyHead,
      student_head: studentHead,
      student_co_head: studentCoHead,
    });
  };

  return (
    <div className="space-y-6 p-1">
      
      {/* Section 1: Organization Details */}
      <div className="space-y-4">        
        <div className="grid grid-cols-1 gap-4">
            <div className="space-y-3">
                <Label htmlFor="name">Organization Name</Label>
                <div className="relative">
                    <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9"
                        placeholder="e.g. Coding Club"
                    />
                </div>
            </div>

                <div className="space-y-3">
                    <Label htmlFor="email">Contact Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-9"
                            placeholder="org@college.edu"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="orgType">Type</Label>
                    <Select value={orgType} onValueChange={(value) => setOrgType(value as Organizer["org_type"])}>
                    <SelectTrigger id="orgType" className="w-full">
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="CLUB">Club</SelectItem>
                        <SelectItem value="DEPARTMENT">Department</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-4">
            <div className="space-y-3">
                <Label htmlFor="facultyHead">Faculty Head</Label>
                <div className="relative">
                    <GraduationCap className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="facultyHead"
                        type="text"
                        value={facultyHead}
                        onChange={(e) => setFacultyHead(e.target.value)}
                        className="pl-9"
                        placeholder="Dr. Smith"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                    <Label htmlFor="studentHead">Student Head</Label>
                    <div className="relative">
                        <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="studentHead"
                            type="text"
                            value={studentHead}
                            onChange={(e) => setStudentHead(e.target.value)}
                            className="pl-9"
                            placeholder="Jane Doe"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="studentCoHead">Student Co-Head</Label>
                    <div className="relative">
                        <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="studentCoHead"
                            type="text"
                            value={studentCoHead}
                            onChange={(e) => setStudentCoHead(e.target.value)}
                            className="pl-9"
                            placeholder="John Smith"
                        />
                    </div>
                </div>
            </div>
        </div>
      </div>

      <ErrorMessage title="Failed to update organizer" message={error?.message} />

      <div className="pt-2">
        <Button
            onClick={handleSubmit}
            className="w-full font-semibold"
            disabled={isPending}
        >
            {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                </>
            ) : (
                <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </>
            )}
        </Button>
      </div>
    </div>
  );
}