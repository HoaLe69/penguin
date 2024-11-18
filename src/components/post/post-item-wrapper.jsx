import { Box, useToast, useDisclosure } from '@chakra-ui/react'
import Post from './post-item'
import FeedModal from '../modals/feed'
import { memo, useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { reactPost } from '../../redux/api-request/posts'

const PostItemWrapper = ({ ...postInfo }) => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const userLogin = useSelector(state => state.auth.authState.user)
  const [postReactionList, setPostReactionList] = useState(() => postInfo.like)

  const handleShowPostModal = useCallback(() => {
    onOpen()
  }, [])

  const isUserLoginLikeThisPost = useMemo(() => {
    return postReactionList?.includes(userLogin?.id)
  }, [postReactionList.length])

  const handleLeaveEmojiPost = useCallback(async () => {
    try {
      await reactPost(postInfo.id, userLogin?.id)
      if (isUserLoginLikeThisPost) {
        setPostReactionList(pre => pre.filter(l => l !== userLogin?.id))
        return
      }
      setPostReactionList(pre => [...pre, userLogin?.id])
    } catch (error) {
      // run toast message here
      console.log(error)
      toast({
        title: 'Post',
        position: 'bottom-left',
        description: error.response.data || 'Something went wrong',
        status: 'info',
        duration: 1500,
        isClosable: true
      })
    }
  }, [userLogin, isUserLoginLikeThisPost])
  return (
    <Box>
      <Post
        {...postInfo}
        activeReactButton={isUserLoginLikeThisPost}
        postReactionList={postReactionList}
        handleReactPost={handleLeaveEmojiPost}
        handleShowPostModal={handleShowPostModal}
      />
      {isOpen && (
        <FeedModal
          isOpen={isOpen}
          onClose={onClose}
          postInfo={postInfo}
          postReactionList={postReactionList}
          activeReactButton={isUserLoginLikeThisPost}
          handleReactPost={handleLeaveEmojiPost}
        />
      )}
    </Box>
  )
}

export default memo(PostItemWrapper)
