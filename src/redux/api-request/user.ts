import { Dispatch } from '@reduxjs/toolkit'
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailed,
  followOtherUserStart,
  followOtherUserFailed,
  getListUserFollowingStart,
  getListUserFollowingSuccess,
  getListUserFollowingFailed,
  getListUserFollowerStart,
  getListUserFollowerFailed,
  getListUserFollowerSuccess,
  getUserProfileStart,
  getUserProfileSuccess,
  getUserProfileFailure
} from '../userSlice'
import axiosClient from '../../config/axios'
import { updateUserLoginFollowingList, verifyUserFailure, verifyUserSuccess, User } from '../authSlice'

export interface UpdateUserPayload {
  id: string
  [key: string]: unknown
}

// verify current session user
export const verifyUser = async (dispatch: Dispatch): Promise<User | undefined> => {
  try {
    const user = await axiosClient.get<User>('/user/verify')
    dispatch(verifyUserSuccess(user))
    return user
  } catch (error) {
    console.log(error)
    dispatch(verifyUserFailure())
    return undefined
  }
}

// get user profile
export const getUserProfile = async (dispatch: Dispatch, userId: string): Promise<void> => {
  dispatch(getUserProfileStart())
  try {
    const res = await axiosClient.get<User>(`/user/${userId}`)
    dispatch(getUserProfileSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getUserProfileFailure())
  }
}

//update current user
export const updateUser = async (dispatch: Dispatch, updateInfo: UpdateUserPayload): Promise<void> => {
  dispatch(updateUserStart())
  try {
    const res = await axiosClient.patch<User>(`/user/update/${updateInfo.id}`, updateInfo)
    dispatch(updateUserSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(updateUserFailed())
  }
}

//follow orther user
export const followOtherUser = async (dispatch: Dispatch, friendId: string, userLoginId: string): Promise<void> => {
  dispatch(followOtherUserStart())
  try {
    const res = await axiosClient.patch<User>(`/user/interactive/${friendId}`, { id: userLoginId })
    const listFollowerOfCurrentUserProfile = res?.follower

    //userlogin start to follow this user
    if (listFollowerOfCurrentUserProfile?.includes(userLoginId)) {
      dispatch(updateUserLoginFollowingList({ actions: 'follow', userFollowId: res.id }))
    } else {
      // userlogin unfollow this user
      dispatch(updateUserLoginFollowingList({ actions: 'unfollow', userFollowId: res.id }))
    }
    dispatch(getUserProfileSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(followOtherUserFailed())
  }
}

// get list following
export const getListFollowing = async (dispatch: Dispatch, listIdUser: string[]): Promise<void> => {
  dispatch(getListUserFollowingStart())
  try {
    const res = await axiosClient.post<User[]>(`/user/getUserFollow`, { list: listIdUser })
    dispatch(getListUserFollowingSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getListUserFollowingFailed())
  }
}

// get list follower
export const getListFollower = async (dispatch: Dispatch, listIdUser: string[]): Promise<void> => {
  dispatch(getListUserFollowerStart())
  try {
    const res = await axiosClient.post<User[]>(`/user/getUserFollow`, { list: listIdUser })
    dispatch(getListUserFollowerSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getListUserFollowerFailed())
  }
}
