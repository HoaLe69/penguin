import { Box } from '@chakra-ui/react'
import { BeatLoader } from 'react-spinners'
import Post from './post-item'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getAllPostFromUserFollowing } from '@redux/api-request/posts'
import EmptyState from '../empty-state'

const PostFollowing = ({ index }) => {
  const dispatch = useDispatch()
  const posts = useSelector(state => state.post.allPostFromUser.posts)
  const isLoading = useSelector(state => state.post.allPostFromUser.isFetching)
  const userLogin = useSelector(state => state.auth.authState.user)

  useEffect(() => {
    if (userLogin?.following) getAllPostFromUserFollowing(dispatch, userLogin?.following)
  }, [userLogin?.following?.length, index])
  return (
    <Box pt={4}>
      {!isLoading && !posts?.length ? (
        <EmptyState title="No users following" />
      ) : (
        <>
          {isLoading ? (
            <Box minH="400px" pt={2} display="flex" alignItems="center" justifyContent="center">
              <BeatLoader color="white" />
            </Box>
          ) : (
            posts?.map(function (post) {
              return <Post key={post.id} {...post} />
            })
          )}
        </>
      )}
    </Box>
  )
}

export default PostFollowing
