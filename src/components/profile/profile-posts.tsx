import { Box, useToast, Heading, Image, Grid, GridItem, useDisclosure } from '@chakra-ui/react'
import { AiFillHeart } from 'react-icons/ai'
import { getAllPostUser, reactPost } from '@redux/api-request/posts'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { Post } from '@redux/postSlice'
import FeedModal from '../modals/feed'
import { ProfilePostSkeletonLoading } from '../loading'

// Post['like'] is only covered by postSlice's Post index signature (unknown) today - narrowed
// here to string[] (list of userIds who reacted) since this component relies on array methods.
interface PostWithLike extends Post {
  like?: string[]
}

function ProfilePostItem(props: PostWithLike) {
  const postInfo = props
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toast = useToast()
  const userLogin = useAppSelector(state => state.auth.authState.user)
  const [postReactionList, setPostReactionList] = useState<string[] | undefined>(() => postInfo.like)

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
    <Box position="relative" role="group" cursor="pointer" onClick={handleShowPostModal}>
      <Box height={{ base: '300px', lg: '400px' }}>
        {postInfo.fileType == 'image' ? (
          <Image src={postInfo?.thumbnail} alt={postInfo?.id} height="full" width="full" objectFit="cover" />
        ) : (
          <video style={{ width: '100%', height: '100%' }} src={postInfo.videoSrc}></video>
        )}
      </Box>
      <Box
        position="absolute"
        top={0}
        right={0}
        left={0}
        bottom={0}
        display="none"
        bg={'blackAlpha.500'}
        _groupHover={{ display: 'grid' }}
        placeItems="center"
      >
        <Box display="flex" alignItems="center" gap="5px" color="whiteAlpha.800">
          {postReactionList?.length} <AiFillHeart />
        </Box>
        <FeedModal
          isOpen={isOpen}
          onClose={onClose}
          postInfo={postInfo}
          postReactionList={postReactionList}
          activeReactButton={isUserLoginLikeThisPost}
          handleReactPost={handleLeaveEmojiPost}
        />
      </Box>
    </Box>
  )
}

interface ProfilePostProps {
  userProfileId: string
}

function ProfilePost(props: ProfilePostProps) {
  const { userProfileId } = props
  const dispatch = useAppDispatch()
  const profilePost = useAppSelector(state => state.post.getPostUser.posts)
  const isLoading = useAppSelector(state => state.post.getPostUser.isFetching)

  useEffect(() => {
    getAllPostUser(dispatch, userProfileId)
  }, [userProfileId, dispatch])

  return (
    <Box pt={5}>
      <Heading
        textAlign="center"
        fontSize={'md'}
        textUnderlineOffset={4}
        textDecoration="underline"
        // pre-existing value; Chakra's type only accepts a CSS length string (or 0) here, so cast to
        // preserve the exact (already invalid-per-CSS-spec, effectively no-op) prior behavior unchanged
        textDecorationThickness={4 as unknown as string}
        textDecorationColor="gray.500"
      >
        All post
      </Heading>
      {isLoading ? (
        <ProfilePostSkeletonLoading />
      ) : (
        <Grid
          templateColumns={{
            base: 'repeat(2, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3 , 1fr)',
            lg: 'repeat(3 , 1fr) '
          }}
          gap={2}
          pt={4}
        >
          {profilePost.map(data => {
            return (
              <GridItem key={data.id}>
                <ProfilePostItem {...(data as PostWithLike)} />
              </GridItem>
            )
          })}
        </Grid>
      )}
    </Box>
  )
}

export default ProfilePost
