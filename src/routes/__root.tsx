import { Outlet, createRootRoute } from '@tanstack/react-router'
import { ThemeProvider } from '../components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { NotFound } from './not-found'

function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="p-6 text-red-500">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <pre>{error.message}</pre>
    </div>
  )
}

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="dark" attribute="class" storageKey="theme">
      <Outlet />
      <Toaster position='top-center'/>
    </ThemeProvider>
  ),
  notFoundComponent: NotFound,
  errorComponent: ErrorComponent,
})
