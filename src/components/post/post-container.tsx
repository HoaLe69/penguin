import { Box, Button, HStack } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { memo, useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { createPostCleanOldState, deletePostCleanOldState, editPostCleanOldState } from '../../redux/postSlice'
import { RootState } from '../../redux/store'
import { getAllPost } from '../../redux/api-request/posts'
import useRefreshable from '../../hooks/useRefreshable'
import { PostSkeletonLoading } from '../loading'
import PostItemWrapper from './post-item-wrapper'

function PostContainer() {
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [posts, setPosts] = useState<any[]>([])
  const [page, setPage] = useState(0)
  const dispatch = useDispatch()
  const { ref, inView } = useInView()

  const postDeletedId = useSelector((state: RootState) => state.post.deletePost.id)
  const postEdited = useSelector((state: RootState) => state.post.editPost.post)
  const postCreated = useSelector((state: RootState) => state.post.createPost.post)

  const fetchPost = useCallback(async () => {
    if (loading || !hasMore) return
    try {
      setLoading(true)
      const response = await getAllPost(page)
      if (!response?.length) {
        setHasMore(false)
        return
      }
      setPosts(pre => [...pre, ...(response || [])])
      setPage(pre => pre + 1)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [page, hasMore, loading])

  useEffect(() => {
    if (inView) {
      fetchPost()
    }
  }, [inView, fetchPost])

  const handleRefreshPost = useCallback(async () => {
    setPosts([])
    setPage(0)
    setHasMore(true)
    await fetchPost()
  }, [fetchPost])

  useRefreshable('posts', handleRefreshPost)

  // remove post
  useEffect(() => {
    if (!postDeletedId) return
    setPosts(pre => {
      const filter = pre.filter(post => post.id !== postDeletedId)
      return filter
    })
    return () => {
      if (postDeletedId) dispatch(deletePostCleanOldState())
    }
  }, [postDeletedId, dispatch])

  // edit post
  useEffect(() => {
    if (!postEdited) return
    setPosts(pre => {
      const changed = pre.map(post => {
        if (post.id === postEdited.id) {
          return postEdited
        }
        return post
      })
      return changed
    })
    return () => {
      if (postEdited) dispatch(editPostCleanOldState())
    }
  }, [postEdited, dispatch])

  // new post
  useEffect(() => {
    if (!postCreated) return
    setPosts(pre => [postCreated, ...pre])
    return () => {
      if (postCreated) dispatch(createPostCleanOldState())
    }
  }, [postCreated, dispatch])

  return (
    <Box pt={4}>
      {posts?.map(function (post) {
        return <PostItemWrapper key={post.id} {...post} />
      })}
      <Box pt={2} ref={ref} display="flex" flexDir="column" justifyContent="center">
        {loading && <PostSkeletonLoading />}
      </Box>
      {!hasMore && (
        <HStack justifyContent="center">
          <Button onClick={handleRefreshPost}>Refresh</Button>
        </HStack>
      )}
    </Box>
  )
}

export default memo(PostContainer)
