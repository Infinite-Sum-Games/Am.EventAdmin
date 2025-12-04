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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
const editOrgSchema = z.object({
  name: z.string().min(3, "Organizer name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  orgType: z.enum(["DEPARTMENT", "CLUB"]),
  studentHead: z.string().min(3, "Student head is required"),
  studentCoHead: z.string().optional(),
  facultyHead: z.string().min(3, "Faculty head is required"),
});

type EditOrgFormValues = z.infer<typeof editOrgSchema>;

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditOrgFormValues>({
    resolver: zodResolver(editOrgSchema),
    defaultValues: {
      name: organizer_name,
      email: organizer_email,
      orgType: organizer_type,
      studentHead: student_head,
      studentCoHead: student_co_head ?? "",
      facultyHead: faculty_head,
      password: "",
    },
  });

  const onSubmit = async (data: EditOrgFormValues) => {
    try {
      const hashedPassword = data.password
        ? SHA256(data.password).toString()
        : undefined;

      const payload = {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        org_type: data.orgType,
        student_head: data.studentHead,
        student_co_head: data.studentCoHead || null,
        faculty_head: data.facultyHead,
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
    }
  };

  return (
    <form className="grid gap-4 pt-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <Label>Organizer Name</Label>
        <Input {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label>Email</Label>
        <Input type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label>New Password</Label>
        <Input
          type="password"
          {...register("password")}
          placeholder="Please dont leave this blank"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label>Organizer Type</Label>
        <Select
          defaultValue={organizer_type}
          onValueChange={(val) => setValue("orgType", val as OrganizerType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DEPARTMENT">Department</SelectItem>
            <SelectItem value="CLUB">Club</SelectItem>
          </SelectContent>
        </Select>
        {errors.orgType && (
          <p className="text-sm text-red-500">{errors.orgType.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label>Student Head</Label>
        <Input {...register("studentHead")} />
        {errors.studentHead && (
          <p className="text-sm text-red-500">{errors.studentHead.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label>Student Co-Head</Label>
        <Input {...register("studentCoHead")} />
      </div>
      <div className="grid gap-2">
        <Label>Faculty Head</Label>
        <Input {...register("facultyHead")} />
        {errors.facultyHead && (
          <p className="text-sm text-red-500">{errors.facultyHead.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
        {isSubmitting ? "Editing..." : "Edit Organizer"}
        {!isSubmitting && <Edit3 className="ml-2 h-4 w-4" />}
      </Button>
    </form>
  );
}
