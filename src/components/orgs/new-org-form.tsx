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
import { PlusCircle } from "lucide-react";
import type { OrganizerType } from "@/types/db";
import { axiosClient } from "@/lib/axios";
import { api } from "@/lib/api";
import sha256 from "crypto-js/sha256";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

// ✅ Zod Schema
const newOrgSchema = z.object({
  name: z.string().min(3, "Organizer name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  orgType: z.enum(["DEPARTMENT", "CLUB"]),
  studentHead: z.string().min(3, "Student head is required"),
  studentCoHead: z.string().optional(),
  facultyHead: z.string().min(3, "Faculty head is required"),
});

type NewOrgFormValues = z.infer<typeof newOrgSchema>;

interface NewOrgFormProps {
  onSuccess: () => void;
}

export function NewOrgForm({ onSuccess }: NewOrgFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewOrgFormValues>({
    resolver: zodResolver(newOrgSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      orgType: undefined,
      studentHead: "",
      studentCoHead: "",
      facultyHead: "",
    },
  });

  const onSubmit = async (data: NewOrgFormValues) => {
    try {
      const hashedPassword = sha256(data.password).toString();

      await axiosClient.post(api.CREATE_ORGANIZER, {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        org_type: data.orgType,
        student_head: data.studentHead,
        student_co_head: data.studentCoHead || null,
        faculty_head: data.facultyHead,
      });

      alert(`Successfully created organizer: ${data.name}`);
      reset();
      onSuccess();
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error;

        if (message?.includes("organizer_email_key")) {
          alert("Email already exists. Please use a different email.");
        } else {
          alert(message || "Failed to create organizer");
        }
      } else {
        alert("Unexpected error occurred");
      }
    }
  };

  return (
    <form className="grid gap-4 pt-4" onSubmit={handleSubmit(onSubmit)}>
      {/* Organizer Name */}
      <div className="grid gap-2">
        <Label>Organizer Name</Label>
        <Input {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="grid gap-2">
        <Label>Official Email</Label>
        <Input type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="grid gap-2">
        <Label>Password</Label>
        <Input type="password" {...register("password")} />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Organizer Type */}
      <div className="grid gap-2">
        <Label>Organizer Type</Label>
        <Select
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

      {/* Student Head */}
      <div className="grid gap-2">
        <Label>Student Head</Label>
        <Input {...register("studentHead")} />
        {errors.studentHead && (
          <p className="text-sm text-red-500">{errors.studentHead.message}</p>
        )}
      </div>

      {/* Student Co-Head */}
      <div className="grid gap-2">
        <Label>Student Co-Head</Label>
        <Input {...register("studentCoHead")} />
      </div>

      {/* Faculty Head */}
      <div className="grid gap-2">
        <Label>Faculty Head</Label>
        <Input {...register("facultyHead")} />
        {errors.facultyHead && (
          <p className="text-sm text-red-500">{errors.facultyHead.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Organizer"}
        {!isSubmitting && <PlusCircle className="ml-2 h-4 w-4" />}
      </Button>
    </form>
  );
}
