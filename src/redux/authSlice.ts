import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  displayName?: string
  email?: string
  avatar?: string
  following: string[]
  follower?: string[]
  [key: string]: unknown
}

interface RequestState {
  isFetching: boolean
  success?: boolean
  error: boolean
  message?: string | null
}

export interface AuthState {
  authState: {
    user: User | null
    isAuthenticated: boolean | null
  }
  loginState: RequestState
  register: RequestState
}

const initialState: AuthState = {
  authState: {
    user: null,
    isAuthenticated: null
  },
  loginState: {
    isFetching: false,
    success: false,
    error: false,
    message: null
  },
  register: {
    isFetching: false,
    success: false,
    error: false,
    message: null
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    verifyUserSuccess: (state, action: PayloadAction<User>) => {
      state.authState.user = action.payload
      state.authState.isAuthenticated = true
    },
    verifyUserFailure: state => {
      state.authState.user = null
      state.authState.isAuthenticated = false
    },
    updateUserLoginFollowingList: (
      state,
      action: PayloadAction<{ actions: 'follow' | 'unfollow'; userFollowId: string }>
    ) => {
      const { actions, userFollowId } = action.payload
      const currentUserLoginInfo = state.authState.user
      if (!currentUserLoginInfo) return
      const currentUserLoginFollowingList =
        actions === 'follow'
          ? [...currentUserLoginInfo.following, userFollowId]
          : currentUserLoginInfo.following.filter(followingId => followingId !== userFollowId)

      state.authState.user = {
        ...currentUserLoginInfo,
        following: currentUserLoginFollowingList
      }
    },
    loginStart: state => {
      state.loginState.isFetching = true
      state.loginState.message = null
    },
    loginSuccess: state => {
      state.loginState.isFetching = false
      state.loginState.error = false
      state.loginState.success = true
      state.loginState.message = null
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.loginState.error = true
      state.loginState.isFetching = false
      state.loginState.message = action.payload
    },
    registerStart: state => {
      state.register.isFetching = true
    },
    registerSuccess: state => {
      state.register.isFetching = false
      state.register.success = true
    },
    registerFailed: (state, action: PayloadAction<string>) => {
      state.register.error = true
      state.register.isFetching = false
      state.register.message = action.payload
    }
  }
})

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  registerStart,
  registerFailed,
  registerSuccess,
  verifyUserSuccess,
  verifyUserFailure,
  updateUserLoginFollowingList
} = authSlice.actions

export default authSlice.reducer
