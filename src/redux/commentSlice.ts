import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Comment {
  id: string
  postId?: string
  userId?: string
  content?: string
  [key: string]: unknown
}

export interface CommentState {
  allComment: {
    isFetching: boolean
    error: boolean
    comment: Comment[]
  }
  amountCommentCurrPost: number | null
}

const initialState: CommentState = {
  allComment: {
    isFetching: false,
    error: false,
    comment: []
  },
  amountCommentCurrPost: null
}

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    getAllCommentStart: state => {
      state.allComment.isFetching = true
    },
    getAllCommentSuccess: (state, action: PayloadAction<Comment[]>) => {
      state.allComment.isFetching = false
      state.allComment.comment = action.payload
      state.allComment.error = false
    },
    getAllCommentFailed: state => {
      state.allComment.isFetching = false
      state.allComment.error = true
    },
    getAmountCommentCurrPost: (state, action: PayloadAction<number>) => {
      state.amountCommentCurrPost = action.payload
    }
  }
})

export const { getAllCommentStart, getAllCommentSuccess, getAllCommentFailed, getAmountCommentCurrPost } =
  commentSlice.actions
export default commentSlice.reducer
