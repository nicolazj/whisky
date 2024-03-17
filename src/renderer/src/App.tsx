import { ThemeProvider } from './components/theme-provider'
import { RouterProvider, createRouter } from '@tanstack/react-router'
// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { TooltipProvider } from './components/tooltip'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}



function App(): JSX.Element {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
       <TooltipProvider delayDuration={0}>
       <RouterProvider router={router} />

       </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
