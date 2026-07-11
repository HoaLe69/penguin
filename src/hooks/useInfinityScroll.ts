import { useCallback, useRef, useState, Dispatch, SetStateAction } from 'react'

export interface UseInfinityScrollResult {
  lastPostRef: (node: HTMLElement | null) => void
  page: number
  setHasmore: Dispatch<SetStateAction<boolean>>
}

const useInfinity = (): UseInfinityScrollResult => {
  const [page, setPage] = useState<number>(0)
  const [hasMore, setHasmore] = useState<boolean>(false)
  const observer = useRef<IntersectionObserver | null>(null)
  const lastPostRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore) {
            setPage(pre => pre + 1)
          }
        },
        {
          threshold: 1
        }
      )
      if (node) observer.current.observe(node)
    },
    [hasMore]
  )
  return { lastPostRef, page, setHasmore }
}

export default useInfinity
