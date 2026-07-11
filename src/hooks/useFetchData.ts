import { useEffect, useState } from 'react'
import axiosClient from '../config/axios'

export interface UseFetchDataResult<T> {
  isLoading: boolean
  apiData: T | null
  serverError: unknown
}

const useFetchData = <T = unknown>(url: string | null | undefined): UseFetchDataResult<T> => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [apiData, setApiData] = useState<T | null>(null)
  const [serverError, setError] = useState<unknown>(null)
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const res = await axiosClient.get<T>(url as string)
        setApiData(res)
        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }
    if (!url?.includes('null')) fetchData()
  }, [url])
  return { isLoading, apiData, serverError }
}

export default useFetchData
