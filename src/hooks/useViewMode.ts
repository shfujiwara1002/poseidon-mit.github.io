/**
 * useViewMode — Reads/writes the `?view=` search param for Progressive Disclosure.
 *
 * glance = KPI summary only, detail = default, deep = full data + methodology.
 */
import { useMemo, useCallback } from 'react'
import { useRouter } from '../router'

export type ViewMode = 'glance' | 'detail' | 'deep'

const VALID_MODES: ViewMode[] = ['glance', 'detail', 'deep']

export function useViewMode(defaultMode: ViewMode = 'detail'): [ViewMode, (mode: ViewMode) => void] {
  const { search, navigate, path } = useRouter()

  const current = useMemo(() => {
    const params = new URLSearchParams(search)
    const v = params.get('view')
    return v && VALID_MODES.includes(v as ViewMode) ? (v as ViewMode) : defaultMode
  }, [search, defaultMode])

  const setMode = useCallback((mode: ViewMode) => {
    navigate(`${path}?view=${mode}`)
  }, [navigate, path])

  return [current, setMode]
}
