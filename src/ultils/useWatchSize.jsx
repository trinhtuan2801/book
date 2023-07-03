import { useCallback, useEffect, useRef, useState } from "react";

export default function useWatchResize(watched_element) {
  const element = useRef()
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const getSize = useCallback(() => {
    setWidth(element.current?.offsetWidth)
    setHeight(element.current?.offsetHeight)
  }, [])

  useEffect(() => {
    if (watched_element?.current) element.current = watched_element.current
    else if (typeof watched_element === 'string' || typeof watched_element === 'number') {
      element.current = document.getElementById(watched_element.toString())
    }
    getSize()
  }, [element])

  useEffect(() => {
    window.addEventListener('resize', getSize)

    return () => window.removeEventListener('resize', getSize)
  }, [])
  return { width, height }
}