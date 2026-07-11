import axiosClient from '@config/axios'
import {
  createRoomConversationSuccess,
  createRoomConversationFailed,
  createRoomConversationStart,
  getAllRoomConversationStart,
  getAllRoomConversationSuccess,
  getAllRoomConversationFailed
} from '../conversationSlice'

//create room chat
export const createRoomChat = async (dispatch, member) => {
  dispatch(createRoomConversationStart())
  try {
    const res = await axiosClient.post(`/conversation/create`, {
      member: member
    })
    dispatch(createRoomConversationSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(createRoomConversationFailed())
  }
}

//get all room chat
export const getAllRoomConversation = async (dispatch, id) => {
  dispatch(getAllRoomConversationStart())
  try {
    const res = await axiosClient.get(`/conversation/all/${id}`)
    dispatch(getAllRoomConversationSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getAllRoomConversationFailed())
  }
}

// update lastMessage
export const updateLastestMess = async (id, lastestMessage, accessToken) => {
  try {
    await axiosClient.patch(
      `/conversation/update/lastestMessage/${id}`,
      { lastestMessage: lastestMessage },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
  } catch (err) {
    console.log(err)
  }
}
