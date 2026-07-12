import {
  Link,
  HStack,
  useColorModeValue,
  Avatar,
  Heading,
  Text,
  Box,
  Menu,
  MenuItem,
  Button,
  MenuList,
  MenuButton,
  IconButton
} from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Comment } from '../../redux/commentSlice'
import formatTime from '../../util/timeago'
import { AiFillDelete } from 'react-icons/ai'
import { BsThreeDots } from 'react-icons/bs'

interface ReplyCommentItemType extends Comment {
  userId?: string
  replyId?: string
  avatar?: string
  displayName?: string
  createAt?: string
}

interface RootCommentType extends Omit<Comment, 'id'> {
  id: string
  userId?: string
  displayName?: string
}

interface ReplyCommentProps {
  reply: ReplyCommentItemType
  replys: Comment[]
  rootComment: RootCommentType
  setShowReply: (value: (prev: unknown) => unknown) => void
  userOfPost: string | undefined
  handleDeleteComment: (id: string | undefined) => void
}

function ReplyComment({
  reply,
  replys,
  rootComment,
  setShowReply,
  userOfPost,
  handleDeleteComment
}: ReplyCommentProps) {
  const userLoginStr = localStorage.getItem('user')
  const userLogin = userLoginStr ? JSON.parse(userLoginStr) : null
  const replyer = replys.find(rep => rep?.userId === reply?.replyId)
  const bgContent = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const createColor = useColorModeValue('blackAlpha.800', 'whiteAlpha.700')

  const handleDeleteSubComment = async () => {
    await handleDeleteComment(reply?.id)
  }

  return (
    <Box>
      <HStack alignItems="start" py={2}>
        <Link as={ReactRouterLink} to={`/profile/${reply?.userId}`}>
          <Avatar sx={{ width: '24px', height: '24px' }} src={reply?.avatar} name={reply?.displayName} />
        </Link>
        <Box display="flex" flexDir={'column'}>
          <Box bg={bgContent} p={1} px={2} borderRadius="10px">
            <Heading fontSize={'13px'}>{reply?.displayName}</Heading>
            <Heading fontSize="13px" display="inline" mr="2">
              <Link
                as={ReactRouterLink}
                to={`/profile/${replyer?.userId || rootComment?.userId}`}
                color={useColorModeValue('blue.500', 'pink.400')}
              >
                <strong>{(replyer?.displayName || rootComment?.displayName) as string}</strong>
              </Link>
            </Heading>
            <Text display="inline" as="p">
              {reply?.content as string}
            </Text>
          </Box>

          <Text
            ml={2}
            fontSize="12px"
            fontWeight="bold"
            color={useColorModeValue('gray.700', 'whiteAlpha.600')}
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
            onClick={() =>
              setShowReply(
                pre =>
                  ({
                    ...(typeof pre === 'object' && pre !== null ? pre : {}),
                    replyId: reply?.userId,
                    show: true,
                    displayName: reply?.displayName
                  }) as unknown
              )
            }
          >
            reply
          </Text>
        </Box>
        {(userLogin?.id === reply?.userId || rootComment?.id === userOfPost) && (
          <Menu placement="bottom-end">
            <MenuButton size="sm" rounded="full" icon={<BsThreeDots />} as={IconButton} />
            <MenuList>
              <MenuItem leftIcon={<AiFillDelete />} loadingText="delete" as={Button} onClick={handleDeleteSubComment}>
                delete
              </MenuItem>
            </MenuList>
          </Menu>
        )}
        <Text fontSize="12px" color={createColor}>
          {formatTime(reply?.createAt)}
        </Text>
      </HStack>
    </Box>
  )
}

export default ReplyComment
