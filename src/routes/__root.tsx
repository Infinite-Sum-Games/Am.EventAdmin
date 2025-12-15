import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export type RouterContext = {
  queryClient: QueryClient;
  user: any | null;
};

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg">The page you are looking for does not exist.</p>
      <a href="/" className="mt-4 text-primary hover:underline">
        Go to Home
      </a>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="p-6 text-red-500">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <pre>{error.message}</pre>
    </div>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <ThemeProvider defaultTheme="dark" attribute="class" storageKey="theme">
      <Outlet />
      <Toaster position="top-center" />
    </ThemeProvider>
  ),
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
});
