import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import queryString from 'query-string'

// axiosClient/axiosPublic unwrap `response.data` in an interceptor below, so
// every request actually resolves to the payload (T), not AxiosResponse<T>.
// This type overrides axios' method signatures to reflect that at compile time -
// keep any new instance created the same way going through this type.
export interface UnwrappedAxiosInstance extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'patch' | 'delete'> {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>
}

export type ApiResponse<T> = T

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {},
  withCredentials: true,
  paramsSerializer: params => queryString.stringify(params)
}) as unknown as UnwrappedAxiosInstance

axiosClient.interceptors.response.use(
  response => {
    if (response && response.data) {
      return response.data
    }
    return response
  },
  error => {
    throw error
  }
)

export const axiosPublic = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  paramsSerializer: params => queryString.stringify(params)
}) as unknown as UnwrappedAxiosInstance

axiosPublic.interceptors.response.use(
  response => {
    if (response && response.data) {
      return response.data
    }
    return response
  },
  error => {
    throw error
  }
)

export default axiosClient
