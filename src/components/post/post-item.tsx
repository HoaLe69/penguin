import { Box, Text, Link, Image, Avatar, Heading, HStack, Flex, Badge, useColorModeValue } from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'
import MenuPost from '../menu-post'
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useRef, useEffect, useCallback } from 'react'
import { RootState } from '../../redux/store'
import { Post as PostType } from '../../redux/postSlice'
import formatTime from '../../util/timeago'
import { deletePost } from '../../redux/api-request/posts'

interface PostItemProps extends Omit<PostType, 'id'> {
  id?: string
  isModal?: boolean
  isDetail?: boolean
  activeReactButton?: boolean
  amountOfComment?: number | unknown[]
  handleShowPostModal?: () => void
  handleReactPost?: () => void
  postReactionList?: string[]
}

function Post({
  id,
  isModal,
  isDetail,
  activeReactButton,
  amountOfComment,
  handleShowPostModal,
  handleReactPost,
  postReactionList,
  userId,
  photoUrl,
  displayName,
  description,
  tag,
  cloudinaryId,
  fileType,
  videoSrc,
  thumbnail,
  createAt,
  comments,
  ...restProps
}: PostItemProps) {
  const userLogin = useSelector((state: RootState) => state.auth.authState.user)
  const [numberOfLines, setNumberOfLines] = useState(0)
  const pRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()

  const colorReact = useColorModeValue('#1a202c', '#ffffff')
  const bgPost = useColorModeValue('whiteAlpha.700', 'whiteAlpha.200')

  useEffect(() => {
    if (pRef.current) {
      const lineHeight = parseFloat(window.getComputedStyle(pRef.current).lineHeight)
      const height = pRef.current.getBoundingClientRect().height
      const calculatedNumberOfLines = Math.round(height / lineHeight)
      setNumberOfLines(calculatedNumberOfLines)
    }
  }, [])

  const displayPostReaction = useCallback(() => {
    return postReactionList?.length || 0
  }, [postReactionList])

  const handleReadMorePost = () => {
    handleShowPostModal?.()
  }

  const handleDeletePost = useCallback(() => {
    deletePost(dispatch, id as string, cloudinaryId as string, fileType as string)
  }, [id, cloudinaryId, fileType, dispatch])

  const commentCount =
    typeof amountOfComment === 'number' ? amountOfComment : (comments as unknown[] | undefined)?.length || 0

  return (
    <Box mb={4} bg={isModal ? 'none' : bgPost} rounded="10px">
      <HStack as="header" p={2} display="flex">
        <Link
          as={ReactRouterLink}
          to={`/profile/${userId as string}`}
          _hover={{ textDecoration: 'none' }}
          display="flex"
          alignItems="center"
          gap="5px"
        >
          <Avatar src={photoUrl as string} size="md" />
          <Box>
            <Heading as="h3" fontSize="15px">
              {displayName as string}
            </Heading>
            <Text fontSize="12px" textAlign={'left'} color={useColorModeValue('blackAlpha.600', 'whiteAlpha.500')}>
              {formatTime(createAt as string)}
            </Text>
          </Box>
        </Link>
        {userId === userLogin?.id && (
          <Box ml="auto">
            <MenuPost
              onDelete={handleDeletePost}
              postInfo={{
                id: id as string,
                userId: userId as string,
                cloudinaryId: cloudinaryId as string,
                fileType: fileType as string,
                ...restProps
              }}
            />
          </Box>
        )}
      </HStack>
      <Box pl={2}>
        <Text ref={pRef} textAlign="left" noOfLines={numberOfLines >= 3 && !isModal ? 3 : undefined}>
          {description as string}
        </Text>
      </Box>
      <Box display={numberOfLines >= 3 && !isModal ? 'block' : 'none'} textAlign="left" pl={2}>
        <Text
          onClick={handleReadMorePost}
          cursor="pointer"
          fontSize="12px"
          _hover={{ textDecoration: 'underline' }}
          color={useColorModeValue('blue.500', 'pink.500')}
        >
          <strong> read more </strong>
        </Text>
      </Box>
      <Box pb={2} pl={2} textAlign="left">
        {tag && <Badge colorScheme="red">{tag as string}</Badge>}
      </Box>
      {videoSrc && (
        <Box minH="400px" maxH="600px" width="100%" borderRadius="md" overflow="hidden">
          <video
            style={{ height: '600px' }}
            src={videoSrc as string}
            width="100%"
            controls
            playsInline
            preload="metadata"
          >
            Your browser does support the video tag
          </video>
        </Box>
      )}
      {thumbnail && (
        <Box overflow={'hidden'}>
          <Image
            loading="lazy"
            minH="400px"
            maxH="600px"
            w="full"
            src={thumbnail as string}
            alt={displayName as string}
            objectFit={'cover'}
          />
        </Box>
      )}
      <Flex
        py={2}
        px={7}
        justify="space-between"
        borderBottom="1px"
        borderBottomColor={useColorModeValue('blackAlpha.200', 'whiteAlpha.200')}
      >
        <Box display="flex" alignItems="center" gap="5px">
          <Box fontSize="12px" p={1} color="white" bg="pink.400" rounded="full">
            <AiFillHeart />
          </Box>
          <Text lineHeight={1}>{displayPostReaction()}</Text>
        </Box>
        <Box>
          <Text>{commentCount} comments</Text>
        </Box>
      </Flex>
      <Flex
        px={10}
        align="center"
        justify="space-around"
        mt={1}
        borderBottom="1px"
        borderBottomColor={useColorModeValue('blackAlpha.200', 'whiteAlpha.200')}
      >
        <Flex
          flex={1}
          alignItems="center"
          gap={1}
          justify="center"
          py={1}
          rounded="5px"
          _hover={{ bg: useColorModeValue('whiteAlpha.500', 'whiteAlpha.200') }}
          cursor="pointer"
          onClick={handleReactPost}
          color={activeReactButton ? 'pink.400' : colorReact}
        >
          <Box lineHeight={1}>
            <AiOutlineHeart />
          </Box>
          Like
        </Flex>
        <Box flex={1} pointerEvents={isModal ? 'none' : 'auto'} onClick={handleShowPostModal}>
          <Flex
            cursor="pointer"
            py={1}
            rounded="5px"
            _hover={{
              bg: useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
            }}
            flex={1}
            alignItems="center"
            gap={2}
            justify="center"
          >
            <AiOutlineMessage />
            Comments
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

export default Post
