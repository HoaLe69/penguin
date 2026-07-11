import { Dispatch } from '@reduxjs/toolkit'
import axiosClient from '../../config/axios'
import { getAllCommentFailed, getAllCommentStart, Comment } from '../commentSlice'

// Paginated list response - only `content` is consumed by callers today.
export interface PaginatedCommentResponse {
  content: Comment[]
  [key: string]: unknown
}

// get all comment
export const getAllComment = async (
  dispatch: Dispatch,
  postId: string,
  page = 0
): Promise<PaginatedCommentResponse | undefined> => {
  dispatch(getAllCommentStart())
  try {
    const res = await axiosClient.get<PaginatedCommentResponse>(`/comment/${postId}?page=${page}`)
    return res
    //    dispatch(getAllCommentSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getAllCommentFailed())
    return undefined
  }
}
