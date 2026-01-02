// src/components/restricted-access.tsx
import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';
import { Lock } from 'lucide-react';

export function RestrictedAccess() {
  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col items-center justify-center flex-1 min-h-[50vh]">
        <div className="flex flex-col items-center justify-center bg-muted/30 border-2 border-dashed border-muted rounded-xl py-16 px-6 max-w-md w-full text-center">
          <div className="relative bg-background p-4 rounded-full mb-6 shadow-sm ring-1 ring-border">
            <Lock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold tracking-tight">
            Access Restricted
          </h3>
          <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-xs">
            You do not have permission to view this page.
          </p>
          <Button asChild variant="outline">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
