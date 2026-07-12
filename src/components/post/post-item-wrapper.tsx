import { Box, useToast, useDisclosure } from '@chakra-ui/react'
import Post from './post-item'
import FeedModal from '../modals/feed'
import { memo, useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { Post as PostType } from '../../redux/postSlice'
import { reactPost } from '../../redux/api-request/posts'

interface PostItemWrapperProps extends Omit<PostType, 'comments'> {
  like?: string[]
  comments?: number | unknown[]
}

function PostItemWrapper({ like = [], comments = 0, ...postInfo }: PostItemWrapperProps) {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const userLogin = useSelector((state: RootState) => state.auth.authState.user)
  const [postReactionList, setPostReactionList] = useState<string[]>(() => (like as string[]) || [])
  const [amountOfComment, setAmountOfComment] = useState<number>(() => (typeof comments === 'number' ? comments : 0))

  const handleShowPostModal = useCallback(() => {
    onOpen()
  }, [onOpen])

  const handleGetAmountOfComment = useCallback((amount: number) => {
    setAmountOfComment(amount)
  }, [])

  const isUserLoginLikeThisPost = useMemo(() => {
    return postReactionList?.includes(userLogin?.id as string)
  }, [postReactionList.length, userLogin?.id])

  const handleLeaveEmojiPost = useCallback(async () => {
    try {
      if (isUserLoginLikeThisPost) {
        setPostReactionList(pre => pre.filter(l => l !== userLogin?.id))
      } else {
        setPostReactionList(pre => [...pre, userLogin?.id as string])
      }
      await reactPost(postInfo.id as string, userLogin?.id as string)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Post',
        position: 'bottom-left',
        description: (error as any)?.response?.data || 'Something went wrong',
        status: 'info',
        duration: 1500,
        isClosable: true
      })
    }
  }, [userLogin?.id, isUserLoginLikeThisPost, postInfo.id, toast])

  return (
    <Box>
      <Post
        {...postInfo}
        amountOfComment={amountOfComment}
        activeReactButton={isUserLoginLikeThisPost}
        postReactionList={postReactionList}
        handleReactPost={handleLeaveEmojiPost}
        handleShowPostModal={handleShowPostModal}
      />
      {isOpen && (
        <FeedModal
          isOpen={isOpen}
          onClose={onClose}
          postInfo={{ ...postInfo, id: postInfo.id as string, userId: postInfo.userId as string }}
          postReactionList={postReactionList}
          amountOfComment={amountOfComment}
          activeReactButton={isUserLoginLikeThisPost}
          handleReactPost={handleLeaveEmojiPost}
          handleGetAmountOfComment={handleGetAmountOfComment}
        />
      )}
    </Box>
  )
}

export default memo(PostItemWrapper)
