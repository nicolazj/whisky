import { ThemeProvider } from './components/theme-provider'
import { RouterProvider, createRouter } from '@tanstack/react-router'
// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { TooltipProvider } from './components/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Onboarding } from './screens/onboarding'

// Create a new router instance
const router = createRouter({ routeTree })

const queryClient = new QueryClient()

window.electron.ipcRenderer.on('query-client-revalidate', (_event, queryKey: string[]) => {
  console.log('receive ',queryKey)
  queryClient.invalidateQueries({
    queryKey: queryKey
  })
})
// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider delayDuration={0}>
          <RouterProvider router={router} />
          <Onboarding />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
