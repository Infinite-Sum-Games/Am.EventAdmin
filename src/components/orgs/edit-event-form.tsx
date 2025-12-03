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
  onSuccess: () => void;
}

export function EditOrgForm({ onSuccess }: EditOrgFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgType, setOrgType] = useState<OrganizerType | "">("");
  const [studentHead, setStudentHead] = useState("");
  const [facultyHead, setFacultyHead] = useState("");
  const [studentCoHead, setstudentCoHead] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditOrg = () => {
    if (
      !name ||
      !email ||
      !orgType ||
      !studentHead ||
      !facultyHead ||
      !studentCoHead
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
          placeholder="e.g., Computer Science Department"
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
          placeholder="e.g., cse@univ.edu"
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
          placeholder="John Doe"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="student CoHead">Student Co-Head Name</Label>
        <Input
          id="studentCoHead"
          value={studentCoHead}
          onChange={(e) => setstudentCoHead(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="facultyHead">Faculty Head Name</Label>
        <Input
          id="facultyHead"
          value={facultyHead}
          onChange={(e) => setFacultyHead(e.target.value)}
          placeholder="Dr. Smith"
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
