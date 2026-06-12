'use client'

import { useEffect } from 'react'

export function ConsoleGuard() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    // Silence all console output in production to prevent token/PHI leakage via DevTools
    const noop = () => {}
    console.log = noop
    console.debug = noop
    console.info = noop
    console.warn = noop
    // Preserve console.error so runtime errors are still surfaced to monitoring tools
  }, [])

  return null
}
