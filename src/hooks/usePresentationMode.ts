/**
 * usePresentationMode — URL-driven presentation mode toggle.
 *
 * Activated via ?mode=present query param or Cmd+Shift+P keyboard shortcut.
 * Provides { isPresentation, enter, exit } to consuming components.
 */

import { useCallback, useEffect, useMemo } from 'react'
import { useRouter } from '../router'

export interface UsePresentationModeReturn {
  isPresentation: boolean
  enter: () => void
  exit: () => void
}

export function usePresentationMode(): UsePresentationModeReturn {
  const { search, navigate, path } = useRouter()

  const isPresentation = useMemo(() => {
    return new URLSearchParams(search).get('mode') === 'present'
  }, [search])

  const enter = useCallback(() => {
    const params = new URLSearchParams(search)
    params.set('mode', 'present')
    navigate(`${path}?${params.toString()}`)
  }, [navigate, path, search])

  const exit = useCallback(() => {
    const params = new URLSearchParams(search)
    params.delete('mode')
    const qs = params.toString()
    navigate(`${path}${qs ? '?' + qs : ''}`)
  }, [navigate, path, search])

  // Keyboard shortcut: Cmd+Shift+P (Mac) / Ctrl+Shift+P (Windows/Linux)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform)
      const isCommandKey = isMac ? e.metaKey : e.ctrlKey
      if (isCommandKey && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        if (isPresentation) exit()
        else enter()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPresentation, enter, exit])

  return { isPresentation, enter, exit }
}
