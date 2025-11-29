import { Outlet, createRootRoute } from '@tanstack/react-router'
import { ThemeProvider } from '../components/theme-provider'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg">The page you are looking for does not exist.</p>
      {/* Optionally add a link back to home or dashboard */}
      <a href="/" className="mt-4 text-primary hover:underline">Go to Home</a>
    </div>
  )
}

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="system" attribute="class" enableSystem disableTransitionOnChange>
      <Outlet />
    </ThemeProvider>
  ),
  notFoundComponent: NotFound, // Reference the NotFound component here
})
