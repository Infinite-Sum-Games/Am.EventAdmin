import { api } from "@/lib/api";
import { axiosClient } from "@/lib/axios";
import { createOrganizerSchema, type CreateOrganizerInput } from "@/schemas/orgs";
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
  Plus,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ErrorMessage } from "../events/error-message";

// Fixed Props Interface
interface NewOrgFormProps {
  onSuccess: () => void;
}

export function NewOrgForm({ onSuccess }: NewOrgFormProps) {
  // Initial State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgType, setOrgType] = useState<Organizer["org_type"]>("CLUB"); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New State for visibility
  const [facultyHead, setFacultyHead] = useState("");
  const [studentHead, setStudentHead] = useState("");
  const [studentCoHead, setStudentCoHead] = useState("");

  const queryClient = useQueryClient();

  const { mutate: createOrganizer, isPending, error} = useMutation({
    mutationFn: async (payload: CreateOrganizerInput) => {
      // Zod validation
      const validatedData = createOrganizerSchema.safeParse(payload);
      if (!validatedData.success) {
        const errorMessages = validatedData.error.issues.map(issue => issue.message).join("\n");
        throw new Error(errorMessages);
      }

      const response = await axiosClient.post(api.CREATE_ORGANIZER, validatedData.data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Organizer created successfully!");
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
      onSuccess();
    },
    onError: () => {
      toast.error("Error creating organizer");
    },
  });

  const handleSubmit = () => {
    createOrganizer({
      name,
      email,
      org_type: orgType,
      password: password,
      faculty_head: facultyHead,
      student_head: studentHead,
      student_co_head: studentCoHead,
    });
  };

  return (
    <div className="space-y-6 p-1">
      
      {/* Section 1: Organization Details */}
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
                        placeholder="e.g. Robotics Club"
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
                            placeholder="club@college.edu"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            // Toggle type based on state
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            // Added pr-10 so text doesn't go under the eye icon
                            className="pl-9 pr-10"
                            placeholder="Enter a secure password"
                        />
                        {/* Toggle Button */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" aria-hidden="true" />
                            ) : (
                                <Eye className="h-4 w-4" aria-hidden="true" />
                            )}
                            <span className="sr-only">
                                {showPassword ? "Hide password" : "Show password"}
                            </span>
                        </Button>
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

      <Separator />

      {/* Section 2: Leadership */}

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
                        placeholder="Dr. Professor Name"
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
                            placeholder="Student Name"
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
                            placeholder="Student Name"
                        />
                    </div>
                </div>
            </div>
        </div>

      <ErrorMessage title="Failed to create organizer" message={error?.message} />

      <div className="pt-2">
        <Button
            onClick={handleSubmit}
            className="w-full font-semibold"
            disabled={isPending}
        >
            {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                </>
            ) : (
                <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Organizer
                </>
            )}
        </Button>
      </div>
    </div>
  );
}