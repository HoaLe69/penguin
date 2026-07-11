import { useEffect, RefObject } from 'react'

const useClickOutside = <T extends HTMLElement = HTMLElement>(ref: RefObject<T>, callback: () => void): void => {
  useEffect(() => {
    const mouseClickHandler = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }
    document.addEventListener('mousedown', mouseClickHandler)
    return () => {
      document.removeEventListener('mousedown', mouseClickHandler)
    }
  }, [ref, callback])
}

export default useClickOutside
