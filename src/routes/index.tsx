import { createFileRoute, redirect } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { axiosClient } from "@/lib/axios";
import { api } from "@/lib/api";

function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Anokha 2026
        </a>

        <LoginForm />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    try {
      await axiosClient.get(api.SESSION);
      return redirect({
        to: "/dashboard",
      });
    } catch (err) {
      return null;
    }
  },
  component: LoginPage,
});
