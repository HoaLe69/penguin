import {
  Box,
  HStack,
  Avatar,
  Heading,
  Text,
  Link,
  useColorModeValue,
  IconButton,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  Button,
  Spinner
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect, useCallback, memo } from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import InputComment from './input-comment'
import { useStompClient } from '../../hooks/useWebSocket'
import { BsThreeDots } from 'react-icons/bs'
import { AiFillDelete } from 'react-icons/ai'
import formatTime from '../../util/timeago'
import { getAllComment } from '../../redux/api-request/comment'
import { useToast } from '@chakra-ui/react'
import { useInView } from 'react-intersection-observer'
import { getAmountCommentCurrPost } from '../../redux/commentSlice'
import { RootState } from '../../redux/store'
import { Comment as CommentType } from '../../redux/commentSlice'

// STOMP message envelope structure for comments
interface CommentMessageBody {
  action: 'DELETE' | 'ADD'
  id?: string
  comment?: CommentType & { userId?: string; displayName?: string; avatar?: string; createAt?: string }
  amountComment?: number
  error?: string
}

interface IncomingCommentMessageEvent {
  body: CommentMessageBody
}

interface CommentItemProps {
  ownerPostId: string | undefined
  comment: CommentType & { userId?: string; displayName?: string; avatar?: string; createAt?: string }
  onDelete: (id: string | undefined) => void
}

const CommentItem = memo(function CommentItemMemo({ ownerPostId, comment, onDelete }: CommentItemProps) {
  const userLogin = useSelector((state: RootState) => state.auth.authState.user)

  return (
    <Box pos="relative">
      <HStack p={2} px={2} alignItems="start">
        <Link as={ReactRouterLink} to={`/profile/${comment?.userId}`}>
          <Avatar src={comment?.avatar} size="sm" name={comment?.displayName} />
        </Link>
        <Box>
          <Box bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')} p={1} px={2} borderRadius="10px">
            <Heading fontSize={'13px'}>{comment?.displayName}</Heading>
            <Text as="p">{comment?.content}</Text>
          </Box>
        </Box>
        <Box>
          {(userLogin?.id === comment?.userId || userLogin?.id === ownerPostId) && (
            <Menu placement="bottom-end">
              <MenuButton size="sm" rounded="full" icon={<BsThreeDots />} as={IconButton} />
              <MenuList>
                <MenuItem
                  leftIcon={<AiFillDelete />}
                  loadingText="delete"
                  as={Button}
                  onClick={() => onDelete(comment?.id)}
                >
                  delete
                </MenuItem>
              </MenuList>
            </Menu>
          )}
          <Text fontSize="12px" color={useColorModeValue('blackAlpha.800', 'whiteAlpha.700')}>
            {comment?.createAt ? formatTime(comment.createAt) : ''}
          </Text>
        </Box>
      </HStack>
      <Box pl={12}></Box>
    </Box>
  )
})

interface CommentProps {
  postId: string | undefined
  ownerPostId: string | undefined
  handleGetAmountOfComment?: (amount: number) => void
}

function Comment({ postId, ownerPostId, handleGetAmountOfComment }: CommentProps) {
  const toast = useToast()
  const [comments, setComments] = useState<
    (CommentType & { userId?: string; displayName?: string; avatar?: string; createAt?: string })[]
  >([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const { inView, ref } = useInView({ threshold: 1 })

  const userLogin = useSelector((state: RootState) => state.auth.authState.user)

  const handleIncomingComment = useCallback(
    (message: IncomingCommentMessageEvent) => {
      const body = message?.body
      try {
        if (body.error) throw new Error(body.error)
        if (body.action === 'DELETE') {
          setComments(pre => {
            const filterDel = pre.filter(cmt => cmt.id !== body.id)
            return filterDel
          })
        } else {
          if (body.comment) {
            setComments(pre => [body.comment as CommentType & { userId?: string; displayName?: string; avatar?: string; createAt?: string }, ...pre])
          }
        }
        if (typeof handleGetAmountOfComment === 'function') {
          handleGetAmountOfComment(body.amountComment || 0)
        }
      } catch (error) {
        toast({
          title: 'Comment',
          position: 'bottom-left',
          description: (error as any)?.message || 'Something went wrong',
          status: 'info',
          duration: 1500,
          isClosable: true
        })
      }
    },
    [handleGetAmountOfComment, toast]
  )

  const { sendMessage } = useStompClient<IncomingCommentMessageEvent>(`/topic/comments`, postId, handleIncomingComment)

  const dispatch = useDispatch()

  const loadCommentHistory = useCallback(async () => {
    if (loading || !hasMore || !postId) return
    try {
      setLoading(true)
      const response = await getAllComment(dispatch, postId, page)
      if (!response?.content?.length) {
        setHasMore(false)
        return
      }
      setComments(pre => {
        return [...pre, ...(response?.content || [])]
      })
      setPage(pre => pre + 1)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [page, hasMore, loading, dispatch, postId])

  useEffect(() => {
    loadCommentHistory()
  }, [])

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadCommentHistory()
    }
  }, [inView, hasMore, loading, loadCommentHistory])

  const handleDeleteComment = (commentId: string | undefined) => {
    const message: CommentMessageBody = {
      action: 'DELETE',
      id: commentId
    }
    sendMessage(`/app/comments/${postId}`, message)
  }

  const inputBackgroundColor = useColorModeValue('#f0e7db', '#202023')

  return (
    <Box>
      <Box>
        {comments?.map((comment, index) => {
          return (
            <CommentItem
              key={comment?.id || index}
              ownerPostId={ownerPostId}
              comment={comment}
              onDelete={handleDeleteComment}
            />
          )
        })}
      </Box>
      <Box width="full" display="flex" alignItems="center" justifyContent="center" pt="3" pb="16" ref={ref}>
        {loading && <Spinner />}
      </Box>
      <HStack
        position="absolute"
        bottom="0"
        left={0}
        right={0}
        bg={inputBackgroundColor}
        boxShadow="dark-lg"
        alignItems="center"
        px={2}
        py={3}
      >
        <Link>
          <Avatar src={userLogin?.avatar} size="sm" />
        </Link>
        <Box mt={2} bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')} alignItems="center" flex={1}>
          <InputComment isRoot postId={postId} sendMessage={sendMessage} />
        </Box>
      </HStack>
    </Box>
  )
}

export default memo(Comment)
