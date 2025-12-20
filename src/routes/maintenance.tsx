import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Construction, Settings } from "lucide-react";

export function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="relative flex flex-col items-center justify-center bg-muted/30 border-2 border-dashed border-muted rounded-xl py-16 px-6 max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="absolute inset-0 bg-primary/5 rounded-xl blur-xl animate-pulse" />
        <div className="relative bg-background p-5 rounded-full mb-6 shadow-sm ring-1 ring-border">
            <Settings className="absolute -right-1 -top-1 w-6 h-6 text-muted-foreground/60 animate-[spin_3s_linear_infinite]" />
            <Construction className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2 z-10">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Under Maintenance
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
            We are currently performing scheduled maintenance to improve our systems. We should be back shortly.
          </p>
        </div>
        <div className="flex items-center gap-3 z-10 mt-8">
          <Button asChild variant="outline" className="gap-2">
            <Link to="..">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
        <p className="absolute bottom-4 text-[10px] text-muted-foreground/50 uppercase tracking-widest">
            Error Code: 503
        </p>

      </div>
    </div>
  );
}

export const Route = createFileRoute("/maintenance")({
  component: MaintenancePage,
});