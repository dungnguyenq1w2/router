---
id: RouterClass
title: Router Class
---

> 🚧 The `Router` class is deprecated and will be removed in the next major version of TanStack Router. Please use the [`createRouter`](../createRouterFunction) function instead. The constructor and methods associated with this class will be implemented on its functional counterpart in the next major release.

The `Router` class is used to instantiate a new router instance.

## `Router` constructor

The `Router` constructor accepts a single argument: the `options` that will be used to configure the router instance.

### Constructor options

- Type: [`RouterOptions`](../RouterOptionsType)
- Required
- The options that will be used to configure the router instance.

### Constructor returns

- An instance of the [`Router`](../RouterType).

## Examples

```tsx
import { Router, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const router = new Router({
  routeTree,
  defaultPreload: 'intent',
})

export default function App() {
  return <RouterProvider router={router} />
}
```
