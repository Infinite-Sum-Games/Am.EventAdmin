import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Construction, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/dashboard/wip/")({
  component: WorkInProgressPage,
});

function WorkInProgressPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-row gap-4 items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Work in Progress
          </h1>
          <p className="text-muted-foreground">
            This section is currently under development.
          </p>
        </div>

        <Badge variant="secondary" className="text-sm">
          🚧 Coming Soon
        </Badge>
      </div>

      {/* Content */}
      <Card className="mt-4">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-4">
          <Construction className="h-24 w-24 text-muted-foreground" />

          <h2 className="text-xl font-semibold">
            We’re building something awesome
          </h2>

          <p className="text-muted-foreground max-w-md">
            This feature is not available yet. We’re actively working on it and
            it will be ready soon. Thank you for your patience.
          </p>

          <Separator className="my-4 w-1/2" />

          <Button
            variant="outline"
            onClick={() => navigate({to: "/dashboard/events"})}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to Events
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default WorkInProgressPage;