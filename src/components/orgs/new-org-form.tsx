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
import { zodResolver } from "@hookform/resolvers/zod";
import { OrgSchema } from "@/schemas/orgs";
import type z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

type OrgData = z.infer<typeof OrgSchema>;

interface NewOrgFormProps {
  onSuccess: () => void;
}

const createOrganizer = async (data: OrgData) => {
  const hashedPassword = sha256(data.password).toString();

  const dataToSend = { ...data, password: hashedPassword }; 
  console.log("Data to send:", dataToSend);

  const response = await axiosClient.post(api.CREATE_ORGANIZER, dataToSend);
  return response.data;
};

export function NewOrgForm({ onSuccess }: NewOrgFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<OrgData>({
    resolver: zodResolver(OrgSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      org_type: undefined,
      student_head: "",
      student_co_head: "",
      faculty_head: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createOrganizer,
    onSuccess: (variables) => {
      reset(); 
      onSuccess();
    },
    onError: () => {
      toast.error("Failed to create organizer. Please try again.");
    },
  });
  
  const onSubmit = (data: OrgData) => {
    mutation.mutate(data);
  };

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
        <Label htmlFor="email">Official Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Organizer Type */}
      <div className="grid gap-2">
        <Label htmlFor="org_type">Organizer Type</Label>
        <Select
          onValueChange={(val) => setValue("org_type", val as OrganizerType)}
          value={getValues("org_type") as OrganizerType}
        >
          <SelectTrigger id="org_type" className={errors.org_type ? "border-red-500" : ""}>
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
        {errors.student_co_head && (
          <p className="text-sm text-red-500">{errors.student_co_head.message}</p>
        )}
      </div>

      {/* Faculty Head */}
      <div className="grid gap-2">
        <Label htmlFor="faculty_head">Faculty Head</Label>
        <Input id="faculty_head" {...register("faculty_head")} />
        {errors.faculty_head && (
          <p className="text-sm text-red-500">{errors.faculty_head.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full mt-2" 
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Creating..." : "Create Organizer"}
        {!mutation.isPending && <PlusCircle className="ml-2 h-4 w-4" />}
      </Button>
    </form>
  );
}