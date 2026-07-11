import { configureStore } from '@reduxjs/toolkit'
import postReducer from './postSlice'
import authReducer from './authSlice'
import userReducer from './userSlice'
import commentReducer from './commentSlice'
import roomConversationReducer from './conversationSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    user: userReducer,
    room: roomConversationReducer,
    comment: commentReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
