import { Dispatch } from '@reduxjs/toolkit'
import axiosClient from '../../config/axios'
import {
  createRoomConversationSuccess,
  createRoomConversationFailed,
  createRoomConversationStart,
  getAllRoomConversationStart,
  getAllRoomConversationSuccess,
  getAllRoomConversationFailed,
  RoomInfo
} from '../conversationSlice'

//create room chat
export const createRoomChat = async (dispatch: Dispatch, member: string[]): Promise<void> => {
  dispatch(createRoomConversationStart())
  try {
    const res = await axiosClient.post<RoomInfo>(`/conversation/create`, {
      member: member
    })
    dispatch(createRoomConversationSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(createRoomConversationFailed())
  }
}

//get all room chat
export const getAllRoomConversation = async (dispatch: Dispatch, id: string): Promise<void> => {
  dispatch(getAllRoomConversationStart())
  try {
    const res = await axiosClient.get<RoomInfo[]>(`/conversation/all/${id}`)
    dispatch(getAllRoomConversationSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getAllRoomConversationFailed())
  }
}

// update lastMessage
// Note: previously sent a manually-constructed `Authorization: Bearer <accessToken>` header
// (accessToken read from `localStorage.getItem('user')`), separate from axiosClient's
// cookie-based session auth. That localStorage key is never written anywhere in this app
// (auth is fully cookie/session based per CLAUDE.md - see src/config/axios.ts), so the
// header was always `Bearer undefined` - dead/legacy cruft from before the cookie-auth
// migration, not a deliberate backend requirement. This function also has zero callers
// today, so this is a safe cleanup. Dropped the manual header; axiosClient's
// `withCredentials: true` already authenticates the request like every other endpoint here.
export const updateLastestMess = async (id: string, lastestMessage: unknown): Promise<void> => {
  try {
    await axiosClient.patch(`/conversation/update/lastestMessage/${id}`, { lastestMessage: lastestMessage })
  } catch (err) {
    console.log(err)
  }
}
