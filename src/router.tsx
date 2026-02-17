import { createRouter, Outlet } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// Import the generated route tree
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient()
// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    context: {
      queryClient,
    },
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultComponent: DefaultRootComponent,
  })

  return router
}

const DefaultRootComponent = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  )
}
