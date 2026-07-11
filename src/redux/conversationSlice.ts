import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface RoomMember {
  id: string
  displayName?: string
  avatar?: string
  [key: string]: unknown
}

export interface RoomInfo {
  id: string
  member?: string[]
  [key: string]: unknown
}

export interface SelectedRoom {
  info: RoomInfo
  receiver: RoomMember
}

export interface ChatMessage {
  id?: string
  content?: string
  userId?: string
  conversationId?: string
  createAt?: string
  [key: string]: unknown
}

export interface ConversationState {
  selectedRoom: {
    info: RoomInfo | null
    receiver: RoomMember | null
  }
  getLastestMessage: {
    lastestMessage: unknown
    roomId: string | undefined
  }
  createRoomConversation: {
    isFetching: boolean
    error: boolean
    room: unknown
  }
  getAllRoomConversation: {
    isFetching: boolean
    error: boolean
    rooms: RoomInfo[]
  }
  roomFloatSelect: {
    rooms: SelectedRoom[]
  }
}

const initialState: ConversationState = {
  selectedRoom: {
    info: null,
    receiver: null
  },
  getLastestMessage: {
    lastestMessage: undefined,
    roomId: undefined
  },
  createRoomConversation: {
    isFetching: false,
    error: false,
    room: {}
  },
  getAllRoomConversation: {
    isFetching: false,
    error: false,
    rooms: []
  },
  roomFloatSelect: {
    rooms: []
  }
}

const conversationSlice = createSlice({
  name: 'roomConversation',
  initialState,
  reducers: {
    getCurrentSelectedRoom: (state, action: PayloadAction<SelectedRoom>) => {
      state.selectedRoom.info = action.payload.info
      state.selectedRoom.receiver = action.payload.receiver
    },
    chooseRoomFloat: (state, action: PayloadAction<SelectedRoom>) => {
      const isOpened = state.roomFloatSelect.rooms.some(room => {
        return room?.info.id === action.payload.info.id
      })
      const currentOpenRoom = state.roomFloatSelect.rooms.length >= 3
      if (currentOpenRoom && !isOpened) {
        state.roomFloatSelect.rooms = [...state.roomFloatSelect.rooms.slice(1), { ...action.payload }]
      } else {
        if (isOpened) state.roomFloatSelect.rooms = [...state.roomFloatSelect.rooms]
        else state.roomFloatSelect.rooms = [action.payload, ...state.roomFloatSelect.rooms]
      }
    },
    closeRoomFloat: (state, action: PayloadAction<string>) => {
      state.roomFloatSelect.rooms = state.roomFloatSelect.rooms.filter(room => {
        return room.info.id !== action.payload
      })
    },
    getLastestMessage: (state, action: PayloadAction<{ mess: unknown; id: string }>) => {
      state.getLastestMessage.lastestMessage = action.payload.mess
      state.getLastestMessage.roomId = action.payload.id
    },
    createRoomConversationStart: state => {
      state.createRoomConversation.isFetching = true
    },
    createRoomConversationSuccess: (state, action: PayloadAction<unknown>) => {
      state.createRoomConversation.isFetching = false
      state.createRoomConversation.room = action.payload
      state.createRoomConversation.error = false
    },
    createRoomConversationFailed: state => {
      state.createRoomConversation.isFetching = false
      state.createRoomConversation.error = true
    },
    getAllRoomConversationStart: state => {
      state.getAllRoomConversation.isFetching = true
    },

    getAllRoomConversationSuccess: (state, action: PayloadAction<RoomInfo[]>) => {
      state.getAllRoomConversation.isFetching = false
      state.getAllRoomConversation.rooms = action.payload
      state.getAllRoomConversation.error = false
    },
    getAllRoomConversationFailed: state => {
      state.getAllRoomConversation.isFetching = false
      state.getAllRoomConversation.error = true
    }
  }
})

export const {
  closeRoomFloat,
  chooseRoomFloat,
  getLastestMessage,
  createRoomConversationStart,
  createRoomConversationFailed,
  createRoomConversationSuccess,
  getAllRoomConversationStart,
  getAllRoomConversationFailed,
  getAllRoomConversationSuccess,
  getCurrentSelectedRoom
} = conversationSlice.actions

export default conversationSlice.reducer
