import { Dispatch } from '@reduxjs/toolkit'
import { NavigateFunction } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import { loginStart, loginFailed, loginSuccess, registerStart, registerSuccess, registerFailed } from '../authSlice'
import route from '@config/route'
import axiosClient, { axiosPublic } from '../../config/axios'

export interface LoginPayload {
  userName: string
  password: string
}

export interface RegisterPayload {
  userName: string
  email: string
  password: string
}

// Shape returned by Google's userinfo endpoint (https://www.googleapis.com/oauth2/v1/userinfo)
export interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name?: string
  family_name?: string
  picture?: string
  locale?: string
}

const getErrorMessage = (err: unknown): string | undefined => {
  const axiosErr = err as AxiosError<{ message?: string }>
  return axiosErr?.response?.data?.message
}

export const login = async (dispatch: Dispatch, navigate: NavigateFunction, formData: LoginPayload): Promise<void> => {
  dispatch(loginStart())
  try {
    await axiosPublic.post('/auth/login', formData)
    dispatch(loginSuccess())
    navigate(route.home)
  } catch (err) {
    console.log(err)
    dispatch(loginFailed(getErrorMessage(err) || 'Mật khẩu không đúng'))
  }
}

export const getUserProfileFromGoogle = async (token: string): Promise<GoogleUserInfo> => {
  const res = await axios.get<GoogleUserInfo>(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json`, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
  return res.data
}

export const authWithSocial = async (formData: GoogleUserInfo): Promise<unknown> => {
  const res = await axiosClient.post('/auth/loginWithSocial', formData)
  return res
}

//register account
export const register = async (
  dispatch: Dispatch,
  navigate: NavigateFunction,
  formData: RegisterPayload
): Promise<void> => {
  dispatch(registerStart())
  try {
    await axiosPublic.post('/auth/register', formData)
    dispatch(registerSuccess())
  } catch (err) {
    console.log(err)
    dispatch(registerFailed(getErrorMessage(err) || 'Có lỗi khi đăng ký'))
  }
}
