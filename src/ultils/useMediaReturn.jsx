import { useState, useEffect } from 'react'
//queries: [['min' | 'max', number for comparing, result]]
export default function useMediaReturn(queries) {
  const [result, setResult] = useState(false)

  const check = () => {
    for (const query of queries) {
      const [minmax, pixel, result] = query
      const query_str = `(${minmax}-width: ${pixel}px)`
      const media = window.matchMedia(query_str)
      if (media.matches) {
        setResult(result)
        return
      }
    }
    if (queries.length === 1) setResult(false)
  }

  useEffect(() => {
    if (queries && queries.length)
      check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [queries])

  return result
}


