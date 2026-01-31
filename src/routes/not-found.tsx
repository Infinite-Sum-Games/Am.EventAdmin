import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";

export const Route = createFileRoute("/not-found")({
  component: NotFound,
});

export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden">
      <div className="flex flex-col items-center justify-center bg-muted/30 border border-muted rounded-lg py-12 px-6 max-w-md w-full text-center">
        
        {/* Icon Container */}
        <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
          <FileQuestion className="w-10 h-10 text-muted-foreground" />
        </div>

        {/* Text Content */}
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          Page Not Found
        </h3>
        <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-xs mx-auto">
          Dear Admin, the page you are looking for does not exist.
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <Button asChild variant="default" className="flex items-center gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="..">
              Go Back
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}