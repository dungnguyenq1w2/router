import React from 'react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'

import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  useRouteContext,
  rootRouteId,
  redirect,
} from '../src'

import { sleep } from './utils'

afterEach(() => {
  window.history.replaceState(null, 'root', '/')
  cleanup()
})

const WAIT_TIME = 150

describe('beforeLoad in the route definition', () => {
  // Present at the root route
  test('route context, present in the root route', async () => {
    const mock = vi.fn()

    const rootRoute = createRootRoute({
      beforeLoad: ({ context }) => {
        mock(context)
      },
    })
    const routeTree = rootRoute.addChildren([])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(mock).toHaveBeenCalledOnce())
    expect(mock).toHaveBeenCalledWith({ foo: 'bar' })
    expect(mock).toHaveBeenCalledTimes(1)
  })

  test('route context (sleep), present in the root route', async () => {
    const mock = vi.fn()

    const rootRoute = createRootRoute({
      beforeLoad: async ({ context }) => {
        await sleep(WAIT_TIME)
        mock(context)
      },
    })
    const routeTree = rootRoute.addChildren([])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(mock).toHaveBeenCalledOnce())
    expect(mock).toHaveBeenCalledWith({ foo: 'bar' })
    expect(mock).toHaveBeenCalledTimes(1)
  })

  // Present at the index route
  test('route context, present in the index route', async () => {
    const mock = vi.fn()

    const rootRoute = createRootRoute()
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      beforeLoad: ({ context }) => {
        mock(context)
      },
    })
    const routeTree = rootRoute.addChildren([indexRoute])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(mock).toHaveBeenCalledOnce())
    expect(mock).toHaveBeenCalledWith({ foo: 'bar' })
    expect(mock).toHaveBeenCalledTimes(1)
  })

  test('route context (sleep), present in the index route', async () => {
    const mock = vi.fn()

    const rootRoute = createRootRoute()
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      beforeLoad: async ({ context }) => {
        await sleep(WAIT_TIME)
        mock(context)
      },
    })
    const routeTree = rootRoute.addChildren([indexRoute])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(mock).toHaveBeenCalledOnce())
    expect(mock).toHaveBeenCalledWith({ foo: 'bar' })
    expect(mock).toHaveBeenCalledTimes(1)
  })

  // Check if context that is updated at the root, is the same in the index route
  test('modified route context, present in the index route', async () => {
    const mock = vi.fn()

    const rootRoute = createRootRoute({
      beforeLoad: async ({ context }) => {
        await sleep(WAIT_TIME)
        return {
          ...context,
          foo: 'sean',
        }
      },
    })
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      beforeLoad: async ({ context }) => {
        mock(context)
      },
    })
    const routeTree = rootRoute.addChildren([indexRoute])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(mock).toHaveBeenCalledOnce())
    expect(mock).toHaveBeenCalledWith({ foo: 'sean' })
    expect(mock).toHaveBeenCalledTimes(1)
  })

  // Check if context the context is available after a redirect
  test('route context is present in the /about route after a redirect is thrown in the beforeLoad of the index route', async () => {
    const mock = vi.fn()

    const rootRoute = createRootRoute()
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      beforeLoad: async () => {
        await sleep(WAIT_TIME)
        throw redirect({ to: '/about' })
      },
    })
    const aboutRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/about',
      beforeLoad: async ({ context }) => {
        mock(context)
      },
    })
    const routeTree = rootRoute.addChildren([aboutRoute, indexRoute])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(mock).toHaveBeenCalledOnce())
    expect(mock).toHaveBeenCalledWith({ foo: 'bar' })
    expect(mock).toHaveBeenCalledTimes(1)
    expect(router.state.location.pathname).toBe('/about')
  })

  test('route context is present in the /about route after a redirect is thrown in the loader of the index route', async () => {
    const mock = vi.fn()

    const rootRoute = createRootRoute()
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      loader: async () => {
        await sleep(WAIT_TIME)
        throw redirect({ to: '/about' })
      },
    })
    const aboutRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/about',
      beforeLoad: async ({ context }) => {
        mock(context)
      },
    })
    const routeTree = rootRoute.addChildren([aboutRoute, indexRoute])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(mock).toHaveBeenCalledOnce())
    expect(mock).toHaveBeenCalledWith({ foo: 'bar' })
    expect(mock).toHaveBeenCalledTimes(1)
    expect(router.state.location.pathname).toBe('/about')
  })
})

describe('loader in the route definition', () => {
  // Present at the root route
  test('route context, present in the root route', async () => {
    const mock = vi.fn()

    const rootRoute = createRootRoute({
      loader: ({ context }) => {
        mock(context)
      },
    })
    const routeTree = rootRoute.addChildren([])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(mock).toHaveBeenCalledOnce())
    expect(mock).toHaveBeenCalledWith({ foo: 'bar' })
    expect(mock).toHaveBeenCalledTimes(1)
  })

  test('route context (sleep), present in the root route', async () => {
    const mock = vi.fn()

    const rootRoute = createRootRoute({
      loader: async ({ context }) => {
        await sleep(WAIT_TIME)
        mock(context)
      },
    })
    const routeTree = rootRoute.addChildren([])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(mock).toHaveBeenCalledOnce())
    expect(mock).toHaveBeenCalledWith({ foo: 'bar' })
    expect(mock).toHaveBeenCalledTimes(1)
  })

  // Present at the index route
  test('route context, present in the index route', async () => {
    const mock = vi.fn()

    const rootRoute = createRootRoute()
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      loader: ({ context }) => {
        mock(context)
      },
    })
    const routeTree = rootRoute.addChildren([indexRoute])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(mock).toHaveBeenCalledOnce())
    expect(mock).toHaveBeenCalledWith({ foo: 'bar' })
    expect(mock).toHaveBeenCalledTimes(1)
  })

  test('route context (sleep), present in the index route', async () => {
    const mock = vi.fn()

    const rootRoute = createRootRoute()
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      loader: async ({ context }) => {
        await sleep(WAIT_TIME)
        mock(context)
      },
    })
    const routeTree = rootRoute.addChildren([indexRoute])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(mock).toHaveBeenCalledOnce())
    expect(mock).toHaveBeenCalledWith({ foo: 'bar' })
    expect(mock).toHaveBeenCalledTimes(1)
  })

  // Check if context that is updated at the root, is the same in the index route
  test('modified route context, present in the index route', async () => {
    const mock = vi.fn()

    const rootRoute = createRootRoute({
      beforeLoad: async ({ context }) => {
        await sleep(WAIT_TIME)
        return {
          ...context,
          foo: 'sean',
        }
      },
    })
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      loader: async ({ context }) => {
        mock(context)
      },
    })
    const routeTree = rootRoute.addChildren([indexRoute])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(mock).toHaveBeenCalledOnce())
    expect(mock).toHaveBeenCalledWith({ foo: 'sean' })
    expect(mock).toHaveBeenCalledTimes(1)
  })

  // Check if context the context is available after a redirect
  test('route context is present in the /about route after a redirect is thrown in beforeLoad of the index route', async () => {
    const mock = vi.fn()

    const rootRoute = createRootRoute()
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      beforeLoad: async () => {
        await sleep(WAIT_TIME)
        throw redirect({ to: '/about' })
      },
    })
    const aboutRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/about',
      loader: async ({ context }) => {
        mock(context)
      },
    })
    const routeTree = rootRoute.addChildren([aboutRoute, indexRoute])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(mock).toHaveBeenCalledOnce())
    expect(mock).toHaveBeenCalledWith({ foo: 'bar' })
    expect(mock).toHaveBeenCalledTimes(1)
    expect(router.state.location.pathname).toBe('/about')
  })

  test('route context is present in the /about route after a redirect is thrown in loader of the index route', async () => {
    const mock = vi.fn()

    const rootRoute = createRootRoute()
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      loader: async () => {
        await sleep(WAIT_TIME)
        throw redirect({ to: '/about' })
      },
    })
    const aboutRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/about',
      loader: async ({ context }) => {
        mock(context)
      },
    })
    const routeTree = rootRoute.addChildren([aboutRoute, indexRoute])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(mock).toHaveBeenCalledOnce())
    expect(mock).toHaveBeenCalledWith({ foo: 'bar' })
    expect(mock).toHaveBeenCalledTimes(1)
    expect(router.state.location.pathname).toBe('/about')
  })
})

describe('useRouteContext in the component', () => {
  // Present at the root route
  test('route context, present in the root route', async () => {
    const rootRoute = createRootRoute({
      component: () => {
        const context = useRouteContext({ from: rootRouteId })
        return <div>{JSON.stringify(context)}</div>
      },
    })
    const routeTree = rootRoute.addChildren([])
    const ctx = { foo: 'bar' }
    const router = createRouter({ routeTree, context: ctx })

    render(<RouterProvider router={router} />)

    const content = await screen.findByText(JSON.stringify(ctx))

    expect(content).toBeInTheDocument()
  })

  test('route context (sleep in beforeLoad), present in the root route', async () => {
    const rootRoute = createRootRoute({
      beforeLoad: async () => {
        await sleep(WAIT_TIME)
      },
      component: () => {
        const context = useRouteContext({ from: rootRouteId })
        return <div>{JSON.stringify(context)}</div>
      },
    })
    const routeTree = rootRoute.addChildren([])
    const ctx = { foo: 'bar' }
    const router = createRouter({ routeTree, context: ctx })

    render(<RouterProvider router={router} />)

    const content = await screen.findByText(JSON.stringify(ctx))

    expect(content).toBeInTheDocument()
  })

  test('route context (sleep in loader), present root route', async () => {
    const rootRoute = createRootRoute({
      loader: async () => {
        await sleep(WAIT_TIME)
      },
      component: () => {
        const context = useRouteContext({ from: rootRouteId })
        return <div>{JSON.stringify(context)}</div>
      },
    })
    const routeTree = rootRoute.addChildren([])
    const ctx = { foo: 'bar' }
    const router = createRouter({ routeTree, context: ctx })

    render(<RouterProvider router={router} />)

    const content = await screen.findByText(JSON.stringify(ctx))

    expect(content).toBeInTheDocument()
  })

  // Present at the index route
  test('route context, present in the index route', async () => {
    const rootRoute = createRootRoute({})
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      component: () => {
        const context = useRouteContext({ from: rootRouteId })
        return <div>{JSON.stringify(context)}</div>
      },
    })
    const routeTree = rootRoute.addChildren([indexRoute])
    const ctx = { foo: 'bar' }
    const router = createRouter({ routeTree, context: ctx })

    render(<RouterProvider router={router} />)

    const content = await screen.findByText(JSON.stringify(ctx))

    expect(content).toBeInTheDocument()
  })

  test('route context (sleep in beforeLoad), present in the index route', async () => {
    const rootRoute = createRootRoute({})
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      beforeLoad: async () => {
        await sleep(WAIT_TIME)
      },
      component: () => {
        const context = useRouteContext({ from: rootRouteId })
        return <div>{JSON.stringify(context)}</div>
      },
    })
    const routeTree = rootRoute.addChildren([indexRoute])
    const ctx = { foo: 'bar' }
    const router = createRouter({ routeTree, context: ctx })

    render(<RouterProvider router={router} />)

    const content = await screen.findByText(JSON.stringify(ctx))

    expect(content).toBeInTheDocument()
  })

  test('route context (sleep in loader), present in the index route', async () => {
    const rootRoute = createRootRoute({})
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      loader: async () => {
        await sleep(WAIT_TIME)
      },
      component: () => {
        const context = useRouteContext({ from: rootRouteId })
        return <div>{JSON.stringify(context)}</div>
      },
    })
    const routeTree = rootRoute.addChildren([indexRoute])
    const ctx = { foo: 'bar' }
    const router = createRouter({ routeTree, context: ctx })

    render(<RouterProvider router={router} />)

    const content = await screen.findByText(JSON.stringify(ctx))

    expect(content).toBeInTheDocument()
  })

  // Check if context that is updated at the root, is the same in the root route
  test('modified route context, present in the root route', async () => {
    const rootRoute = createRootRoute({
      beforeLoad: async ({ context }) => {
        await sleep(WAIT_TIME)
        return {
          ...context,
          foo: 'sean',
        }
      },
      component: () => {
        const context = useRouteContext({ from: rootRouteId })
        return <div>{JSON.stringify(context)}</div>
      },
    })

    const routeTree = rootRoute.addChildren([])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    const content = await screen.findByText(JSON.stringify({ foo: 'sean' }))

    expect(content).toBeInTheDocument()
  })

  // Check if context that is updated at the root, is the same in the index route
  test('modified route context, present in the index route', async () => {
    const rootRoute = createRootRoute({
      beforeLoad: async ({ context }) => {
        await sleep(WAIT_TIME)
        return {
          ...context,
          foo: 'sean',
        }
      },
    })
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      component: () => {
        const context = useRouteContext({ from: rootRouteId })
        return <div>{JSON.stringify(context)}</div>
      },
    })
    const routeTree = rootRoute.addChildren([indexRoute])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    const content = await screen.findByText(JSON.stringify({ foo: 'sean' }))

    expect(content).toBeInTheDocument()
  })

  // Check if context the context is available after a redirect
  test('route context is present in the /about route after a redirect is thrown in the beforeLoad of the index route', async () => {
    const rootRoute = createRootRoute()
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      beforeLoad: async () => {
        await sleep(WAIT_TIME)
        throw redirect({ to: '/about' })
      },
    })
    const aboutRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/about',
      component: () => {
        const context = useRouteContext({ from: rootRouteId })
        return <div>{JSON.stringify(context)}</div>
      },
    })
    const routeTree = rootRoute.addChildren([aboutRoute, indexRoute])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    const content = await screen.findByText(JSON.stringify({ foo: 'bar' }))

    expect(router.state.location.href).toBe('/about')
    expect(window.location.pathname).toBe('/about')
    expect(content).toBeInTheDocument()
  })

  test('route context is present in the /about route after a redirect is thrown in the loader of the index route', async () => {
    const rootRoute = createRootRoute()
    const indexRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      loader: async () => {
        await sleep(WAIT_TIME)
        throw redirect({ to: '/about' })
      },
    })
    const aboutRoute = createRoute({
      getParentRoute: () => rootRoute,
      path: '/about',
      component: () => {
        const context = useRouteContext({ from: rootRouteId })
        return <div>{JSON.stringify(context)}</div>
      },
    })
    const routeTree = rootRoute.addChildren([aboutRoute, indexRoute])
    const router = createRouter({ routeTree, context: { foo: 'bar' } })

    render(<RouterProvider router={router} />)

    const content = await screen.findByText(JSON.stringify({ foo: 'bar' }))

    expect(router.state.location.href).toBe('/about')
    expect(window.location.pathname).toBe('/about')
    expect(content).toBeInTheDocument()
  })
})
