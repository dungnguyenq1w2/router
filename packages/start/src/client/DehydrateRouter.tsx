import * as React from 'react'
import { Context } from '@tanstack/react-cross-context'
import { useRouter } from '@tanstack/react-router'
import jsesc from 'jsesc'

export function DehydrateRouter() {
  const router = useRouter()

  const dehydratedCtx = React.useContext(
    Context.get('TanStackRouterHydrationContext', {}),
  )

  const dehydrated = router.dehydratedData || dehydratedCtx

  // Use jsesc to escape the stringified JSON for use in a script tag
  const stringified = React.useMemo(
    () =>
      jsesc(router.options.transformer.stringify(dehydrated), {
        isScriptContext: true,
        wrap: true,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <script
      id="__TSR_DEHYDRATED__"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
          window.__TSR_DEHYDRATED__ = {
            data: ${stringified}
          }
        `,
      }}
    />
  )
}
