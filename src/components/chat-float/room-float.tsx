import { useColorModeValue, Heading, Text, Flex, Box, Avatar, Link, Spinner } from '@chakra-ui/react'
import WrapContent from '@components/common/wrap-content'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import { getAllRoomConversation } from '@redux/api-request/room'
import { chooseRoomFloat, RoomInfo, RoomMember } from '@redux/conversationSlice'
import { Link as ReactRouterLink } from 'react-router-dom'
import axiosClient from '../../config/axios'
import EmptyState from '../empty-state'

interface ListConversationProps {
  isOpen: boolean
}

interface ConversationProps {
  room: RoomInfo
  senderId: string | undefined
}

const ListConversation = ({ isOpen }: ListConversationProps) => {
  const dispatch = useAppDispatch()
  const userLogin = useAppSelector(state => state.auth.authState.user)
  const rooms = useAppSelector(state => state.room.getAllRoomConversation.rooms)
  const isFetching = useAppSelector(state => state.room.getAllRoomConversation.isFetching)
  useEffect(() => {
    if (!userLogin?.id || !isOpen) return
    getAllRoomConversation(dispatch, userLogin?.id)
  }, [userLogin, isOpen])
  return (
    <WrapContent title="Messages">
      {isFetching ? (
        <Box minH="60px" display="flex" alignItems="center" justifyContent="center">
          <Spinner />
        </Box>
      ) : !rooms?.length ? (
        <EmptyState title="No rooms chat" />
      ) : (
        rooms?.map((room, index) => {
          return <Conversation senderId={userLogin?.id} key={room?.id || index} room={room} />
        })
      )}
      <Link as={ReactRouterLink} to="/chat">
        <Text textAlign="center" color={useColorModeValue('blue.500', 'pink.400')}>
          See all in Messager
        </Text>
      </Link>
    </WrapContent>
  )
}

const Conversation = ({ room, senderId }: ConversationProps) => {
  const [receiver, setReceiver] = useState<RoomMember>()
  const dispatch = useAppDispatch()

  const receiverId = useMemo(() => {
    return room?.member.find(m => m !== senderId)
  }, [room])

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = await axiosClient.get<RoomMember>(`/user/${receiverId}`)
        setReceiver(user)
      } catch (error) {
        console.log(error)
      }
    }
    if (receiverId) {
      loadUserProfile()
    }
  }, [receiverId])

  const handleSelectRoom = useCallback(() => {
    dispatch(chooseRoomFloat({ info: room, receiver }))
  }, [receiver])
  return (
    <Flex
      onClick={handleSelectRoom}
      gap={'10px'}
      p={2}
      rounded="10px"
      align="center"
      cursor="pointer"
      _hover={{
        backgroundColor: `${useColorModeValue('blackAlpha.200', 'whiteAlpha.300')}`
      }}
    >
      <Avatar src={receiver?.avatar} sx={{ width: '40px', height: '40px' }} />
      <Box>
        <Heading as="h3" fontSize="md">
          {receiver?.displayName}
        </Heading>
        <Text color={useColorModeValue('gray.500', 'whiteAlpha.600')} fontSize="sm" noOfLines={1}></Text>
      </Box>
    </Flex>
  )
}

export default ListConversation
