import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from './authSlice'

export interface UserState {
  userProfile: {
    isFetching: boolean
    info: User | null
    error: boolean
  }
  updateUser: {
    isFetching: boolean
    error: boolean
  }
  followOtherUser: {
    isFetching: boolean
    error: boolean
    user: User | Record<string, never>
  }
  getListUserFollowing: {
    isFetching: boolean
    error: boolean
    listFollowing: User[]
  }
  getListUserFollower: {
    isFetching: boolean
    error: boolean
    listFollower: User[]
  }
}

const initialState: UserState = {
  userProfile: {
    isFetching: false,
    info: null,
    error: false
  },
  updateUser: {
    isFetching: false,
    error: false
  },
  followOtherUser: {
    isFetching: false,
    error: false,
    user: {}
  },
  getListUserFollowing: {
    isFetching: false,
    error: false,
    listFollowing: []
  },
  getListUserFollower: {
    isFetching: false,
    error: false,
    listFollower: []
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUserProfileStart: state => {
      state.userProfile.isFetching = true
      state.userProfile.error = false
    },
    getUserProfileSuccess: (state, action: PayloadAction<User>) => {
      state.userProfile.isFetching = false
      state.userProfile.info = action.payload
      state.userProfile.error = false
      state.followOtherUser.isFetching = false
    },
    getUserProfileFailure: state => {
      state.userProfile.isFetching = false
      state.userProfile.error = true
    },
    updateUserStart: state => {
      state.updateUser.isFetching = true
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.updateUser.isFetching = false
      state.updateUser.error = false
      state.userProfile.info = action.payload
    },
    updateUserFailed: state => {
      state.updateUser.isFetching = false
      state.updateUser.error = true
    },
    followOtherUserStart: state => {
      state.followOtherUser.isFetching = true
    },
    followOtherUserSuccess: (state, action: PayloadAction<User>) => {
      state.followOtherUser.isFetching = false
      state.followOtherUser.error = false
      state.followOtherUser.user = action.payload
    },
    followOtherUserFailed: state => {
      state.followOtherUser.isFetching = false
      state.followOtherUser.error = true
    },
    getListUserFollowingStart: state => {
      state.getListUserFollowing.isFetching = true
    },
    getListUserFollowingSuccess: (state, action: PayloadAction<User[]>) => {
      state.getListUserFollowing.isFetching = false
      state.getListUserFollowing.listFollowing = action.payload
      state.getListUserFollowing.error = false
    },
    getListUserFollowingFailed: state => {
      state.getListUserFollowing.isFetching = false
      state.getListUserFollowing.error = true
    },
    getListUserFollowerStart: state => {
      state.getListUserFollower.isFetching = true
    },
    getListUserFollowerSuccess: (state, action: PayloadAction<User[]>) => {
      state.getListUserFollower.isFetching = false
      state.getListUserFollower.listFollower = action.payload
      state.getListUserFollower.error = false
    },
    getListUserFollowerFailed: state => {
      state.getListUserFollower.isFetching = false
      state.getListUserFollower.error = true
    }
  }
})

export const {
  getUserProfileStart,
  getUserProfileFailure,
  getUserProfileSuccess,
  updateUserFailed,
  updateUserStart,
  updateUserSuccess,
  followOtherUserStart,
  followOtherUserFailed,
  followOtherUserSuccess,
  getListUserFollowingStart,
  getListUserFollowingSuccess,
  getListUserFollowingFailed,
  getListUserFollowerStart,
  getListUserFollowerFailed,
  getListUserFollowerSuccess
} = userSlice.actions

export default userSlice.reducer
