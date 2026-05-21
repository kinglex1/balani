import { createRouter as createTanStackRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create the router instance
const router = createTanStackRouter({
  routeTree,
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
})

// Export both createRouter and getRouter for TanStack Start
export const { getRouter, createRouter } = {
  getRouter: () => router,
  createRouter,
}
