import { useEffect, useState } from 'react'

const useDebounce = <T>(searchValue: T): T => {
  const [searchOutput, setSearchOutput] = useState<T>(searchValue)
  useEffect(() => {
    const timeId = setTimeout(() => {
      setSearchOutput(searchValue)
    }, 500)
    return () => clearTimeout(timeId)
  }, [searchValue])
  return searchOutput
}

export default useDebounce
