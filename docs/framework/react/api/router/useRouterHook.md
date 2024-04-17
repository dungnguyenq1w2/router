---
id: useRouterHook
title: useRouter hook
---

The `useRouter` method is a hook that returns the current instance of [`Router`](../RouterClass) from context. This hook is useful for accessing the router instance in a component.

## useRouter returns

- The current [`Router`](../RouterClass) instance.

## Examples

```tsx
import { useRouter } from '@tanstack/react-router'

function Component() {
  const router = useRouter()
  //    ^ Router

  // ...
}
```
