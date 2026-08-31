"use client"

import * as React from "react"

/**
 * The cart store seeds itself from localStorage at module scope, so the server
 * always renders an empty cart while the client renders the persisted one.
 * Gate cart-dependent output on this so the first client render still matches
 * the server HTML, then fill it in on the effect pass.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = React.useState(false)
  React.useEffect(() => setHydrated(true), [])
  return hydrated
}
