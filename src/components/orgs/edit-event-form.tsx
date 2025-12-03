import { useState } from "react";
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
import { Edit3 } from "lucide-react";
import type { OrganizerType } from "@/types/db";
import SHA256 from "crypto-js/sha256";
import { axiosClient } from "@/lib/axios";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface EditOrgFormProps {
  id: string;
  organizer_name: string;
  organizer_email: string;
  organizer_type: OrganizerType;
  student_head: string;
  student_co_head: string | null;
  faculty_head: string;
  onSuccess: () => void;
}

export function EditOrgForm({
  id,
  organizer_name,
  organizer_email,
  organizer_type,
  student_head,
  student_co_head,
  faculty_head,
  onSuccess,
}: EditOrgFormProps) {
  const queryClient = useQueryClient();

  const [name, setName] = useState(organizer_name);
  const [email, setEmail] = useState(organizer_email);
  const [password, setPassword] = useState("");
  const [orgType, setOrgType] = useState<OrganizerType | "">(organizer_type);
  const [studentHead, setStudentHead] = useState(student_head);
  const [studentCoHead, setstudentCoHead] = useState(student_co_head ?? "");
  const [facultyHead, setFacultyHead] = useState(faculty_head);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditOrg = async () => {
    // ✅ RESET LOADING STATE IF VALIDATION FAILS
    if (!name || !email || !orgType || !studentHead || !facultyHead) {
      alert("Please fill out all required fields.");
      setIsSubmitting(false); // ✅ FIX
      return;
    }

    try {
      setIsSubmitting(true);

      const hashedPassword = password ? SHA256(password).toString() : undefined;

      const payload = {
        name,
        email,
        password: hashedPassword,
        org_type: orgType,
        student_head: studentHead,
        student_co_head: studentCoHead || null,
        faculty_head: facultyHead,
      };

      await axiosClient.put(api.UPDATE_ORGANIZER(id), payload);

      alert("Organizer updated successfully");

      queryClient.invalidateQueries({ queryKey: ["orgs"] });

      onSuccess();
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error;

        if (message?.includes("organizer_email_key")) {
          alert("Email already exists. Use a different one.");
        } else {
          alert(message || "Failed to update organizer");
        }
      } else {
        alert("Unexpected error occurred");
      }
    } finally {
      // ✅ ALWAYS RESET BUTTON STATE
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="grid gap-4 pt-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleEditOrg();
      }}
    >
      <div className="grid gap-2">
        <Label>Organizer Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label>New Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Leave blank to keep same"
        />
      </div>

      <div className="grid gap-2">
        <Label>Organizer Type</Label>
        <Select
          value={orgType}
          onValueChange={(value) => setOrgType(value as OrganizerType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DEPARTMENT">Department</SelectItem>
            <SelectItem value="CLUB">Club</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Student Head</Label>
        <Input
          value={studentHead}
          onChange={(e) => setStudentHead(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label>Student Co-Head</Label>
        <Input
          value={studentCoHead}
          onChange={(e) => setstudentCoHead(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label>Faculty Head</Label>
        <Input
          value={facultyHead}
          onChange={(e) => setFacultyHead(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
        {isSubmitting ? "Editing..." : "Edit Organizer"}
        {!isSubmitting && <Edit3 className="ml-2 h-4 w-4" />}
      </Button>
    </form>
  );
}
