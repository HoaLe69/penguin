import { Dispatch } from '@reduxjs/toolkit'
import { NavigateFunction } from 'react-router-dom'
import {
  createPostStart,
  createPostSuccess,
  createPostFailed,
  deletePostSuccess,
  deletePostFailed,
  deletePostStart,
  getPostUserStart,
  getPostUserSuccess,
  getPostUserFalied,
  getPostByIdStart,
  getPostByIdFailed,
  getPostByIdSuccess,
  getAllPostUserStart,
  getAllPostUserSuccess,
  getAllPostUserFailed,
  editPostStart,
  editPostSuccess,
  editPostFailed,
  Post
} from '../postSlice'
import axiosClient from '../../config/axios'

const baseUrl = process.env.REACT_APP_API_URL

// Paginated list response - only `content` is consumed by callers today.
export interface PaginatedPostResponse {
  content: Post[]
  [key: string]: unknown
}

//create post
export const createPost = async (dispatch: Dispatch, navigate: NavigateFunction, formData: FormData): Promise<void> => {
  dispatch(createPostStart())
  try {
    const res = await axiosClient.post<Post>(`/post/upload`, formData)
    dispatch(createPostSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(createPostFailed())
  }
}

// edit post
export const editPost = async (
  dispatch: Dispatch,
  formData: FormData,
  postId: string,
  cloudId: string
): Promise<void> => {
  dispatch(editPostStart())
  try {
    const res = await axiosClient.patch<Post>(`/post/edit/${postId}/${cloudId}`, formData)
    dispatch(editPostSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(editPostFailed())
  }
}
//get all post
export const getAllPost = async (page: number): Promise<Post[] | undefined> => {
  try {
    const res = await axiosClient.get<PaginatedPostResponse>(`/post/all-post?page=${page}`)
    return res.content
  } catch (err) {
    console.log(err)
    return undefined
  }
}

//deletePost
export const deletePost = async (dispatch: Dispatch, id: string, cloudId: string, fileType: string): Promise<void> => {
  dispatch(deletePostStart())
  try {
    await axiosClient.delete(`/post/delete/${id}/${cloudId}/${fileType}`)
    dispatch(deletePostSuccess(id))
  } catch (err) {
    dispatch(deletePostFailed())
  }
}

// get all post of user
export const getAllPostUser = async (dispatch: Dispatch, id: string): Promise<void> => {
  dispatch(getPostUserStart())
  try {
    const res = await axiosClient.get<Post[]>(`${baseUrl}/post/all-post-user/${id}`)
    dispatch(getPostUserSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getPostUserFalied())
  }
}

// get  post by id
export const getPostById = async (dispatch: Dispatch, id: string): Promise<void> => {
  dispatch(getPostByIdStart())
  try {
    const res = await axiosClient.get<Post>(`/post/${id}`)
    dispatch(getPostByIdSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getPostByIdFailed())
  }
}

// react post
export const reactPost = async (postId: string, userId: string): Promise<Post> => {
  const res = await axiosClient.patch<Post>(`/post/react/${postId}/${userId}`)
  return res
}

// get all post from userFollowing
// get list following

export const getAllPostFromUserFollowing = async (dispatch: Dispatch, listIdUser: string[]): Promise<void> => {
  dispatch(getAllPostUserStart())
  try {
    const res = await axiosClient.post<Post[]>(`${baseUrl}/post/all-post-user-following`, { list: listIdUser })
    dispatch(getAllPostUserSuccess(res))
  } catch (err) {
    console.log(err)
    dispatch(getAllPostUserFailed())
  }
}
