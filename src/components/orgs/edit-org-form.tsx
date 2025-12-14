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
import type { OrganizerType } from "@/types/organizers";
import SHA256 from "crypto-js/sha256";
import { axiosClient } from "@/lib/axios";
import { api } from "@/lib/api";
import { useQueryClient, useMutation } from "@tanstack/react-query"; 
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EditOrgSchema } from "@/schemas/orgs";

type EditOrgFormValues = z.infer<typeof EditOrgSchema>;

const updateOrganizer = async (data: EditOrgFormValues) => {
  const hashedPassword = data.password ? SHA256(data.password).toString() : undefined;

  const dataToSend = {
    ...data,
    password: hashedPassword,
    org_type: data.org_type,
    student_head: data.student_head,
    student_co_head: data.student_co_head || null,
    faculty_head: data.faculty_head,
  };

  const response = await axiosClient.put(api.UPDATE_ORGANIZER(data.id), dataToSend);
  return response.data;
};


export function EditOrgForm({
  id,
  name,
  email,
  org_type,
  student_head,
  student_co_head,
  faculty_head,
  onSuccess,
}: z.infer<typeof EditOrgSchema> & { onSuccess: () => void }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditOrgFormValues>({
    resolver: zodResolver(EditOrgSchema),
    defaultValues: {
      id: id,
      name: name,
      email: email,
      org_type: org_type,
      student_head: student_head,
      student_co_head: student_co_head ?? "", 
      faculty_head: faculty_head,
      password: "", 
    },
  });


  const mutation = useMutation({
    mutationFn: updateOrganizer,
    onSuccess: () => {
      toast.success(`Organizer "${name}" updated successfully.`);
      queryClient.invalidateQueries({ queryKey: ["orgs"] }); 
      
      onSuccess();
    },
    onError: () => {
      toast.error("Failed to create organizer. Please try again.");
    },
  });

  const onSubmit = (data: EditOrgFormValues) => {
    mutation.mutate(data);
  };
  
  const isPending = mutation.isPending;

  return (
    <form className="grid gap-4 pt-4" onSubmit={handleSubmit(onSubmit)}>
      
      {/* Organizer Name */}
      <div className="grid gap-2">
        <Label htmlFor="name">Organizer Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>
      
      {/* Email */}
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      
      {/* New Password */}
      <div className="grid gap-2">
        <Label htmlFor="password">New Password (Leave blank to keep existing)</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          placeholder="Enter a new password (min 6 chars)"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      
      {/* Organizer Type */}
      <div className="grid gap-2">
        <Label htmlFor="org_type">Organizer Type</Label>
        <Select
          defaultValue={org_type}
          onValueChange={(val) => setValue("org_type", val as OrganizerType, { shouldValidate: true })}
        >
          <SelectTrigger id="org_type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DEPARTMENT">Department</SelectItem>
            <SelectItem value="CLUB">Club</SelectItem>
          </SelectContent>
        </Select>
        {errors.org_type && (
          <p className="text-sm text-red-500">{errors.org_type.message}</p>
        )}
      </div>
      
      {/* Student Head */}
      <div className="grid gap-2">
        <Label htmlFor="student_head">Student Head</Label>
        <Input id="student_head" {...register("student_head")} />
        {errors.student_head && (
          <p className="text-sm text-red-500">{errors.student_head.message}</p>
        )}
      </div>
      
      {/* Student Co-Head */}
      <div className="grid gap-2">
        <Label htmlFor="student_co_head">Student Co-Head</Label>
        <Input id="student_co_head" {...register("student_co_head")} />
      </div>
      
      {/* Faculty Head */}
      <div className="grid gap-2">
        <Label htmlFor="faculty_head">Faculty Head</Label>
        <Input id="faculty_head" {...register("faculty_head")} />
        {errors.faculty_head && (
          <p className="text-sm text-red-500">{errors.faculty_head.message}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full mt-2" 
        disabled={isPending}
      >
        {isPending ? "Editing..." : "Edit Organizer"}
        {!isPending && <Edit3 className="ml-2 h-4 w-4" />}
      </Button>
    </form>
  );
}