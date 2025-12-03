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
  organizer_name,
  organizer_email,
  organizer_type,
  student_head,
  student_co_head,
  faculty_head,
  onSuccess,
}: EditOrgFormProps) {
  const [name, setName] = useState(organizer_name);
  const [email, setEmail] = useState(organizer_email);
  const [orgType, setOrgType] = useState<OrganizerType | "">(organizer_type);
  const [studentHead, setStudentHead] = useState(student_head);
  const [studentCoHead, setstudentCoHead] = useState(student_co_head ?? "");
  const [facultyHead, setFacultyHead] = useState(faculty_head);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditOrg = () => {
    if (
      !name ||
      !email ||
      !orgType ||
      !studentHead ||
      !studentCoHead ||
      !facultyHead
    ) {
      alert("Please fill out all required fields.");
      return;
    }
    setIsSubmitting(true);
    console.log("Simulating Edit organizer creation:", {
      name,
      email,
      orgType,
      studentHead,
      studentCoHead,
      facultyHead,
    });
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`(Simulated) Successfully Edited organizer: ${name}`);
      onSuccess();
    }, 1000);
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
        <Label htmlFor="name">Organizer Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={organizer_name}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Official Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder= {organizer_email}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="orgType">Organizer Type</Label>
        <Select
          value={orgType}
          onValueChange={(value) => setOrgType(value as OrganizerType)}
        >
          <SelectTrigger id="orgType">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DEPARTMENT">Department</SelectItem>
            <SelectItem value="CLUB">Club</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="studentHead">Student Head Name</Label>
        <Input
          id="studentHead"
          value={studentHead}
          onChange={(e) => setStudentHead(e.target.value)}
          placeholder={studentHead}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="studentCoHead">Student Co-Head Name</Label>
        <Input
          id="studentCoHead"
          value={studentCoHead}
          onChange={(e) => setstudentCoHead(e.target.value)}
          placeholder={studentCoHead}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="facultyHead">Faculty Head Name</Label>
        <Input
          id="facultyHead"
          value={facultyHead}
          onChange={(e) => setFacultyHead(e.target.value)}
          placeholder={facultyHead}
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
