import WrapContent from '@components/common/wrap-content'
import { Flex, Avatar, Heading, Box, useColorModeValue, Spinner } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAllRoomConversation } from '@redux/api-request/room'
import axiosClient from '../../config/axios'
import { getCurrentSelectedRoom, RoomInfo, RoomMember } from '../../redux/conversationSlice'
import EmptyState from '../empty-state'
import { RootState } from '../../redux/store'

interface CoversItemProps {
  senderId?: string
  room: RoomInfo
  onPressMobile?: () => void
}

const CoversItem = ({ senderId, room, onPressMobile }: CoversItemProps) => {
  const [receiver, setReceiver] = useState<RoomMember | undefined>()
  const selectedRoom = useSelector((state: RootState) => state.room.selectedRoom.info)

  const receiverId = useMemo(() => {
    return room?.member?.find(m => m !== senderId)
  }, [room, senderId])

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

  const dispatch = useDispatch()

  const bgColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.300')

  const handleSelectRoom = useCallback(() => {
    if (typeof onPressMobile === 'function') onPressMobile()
    const payload = {
      info: room,
      receiver
    }
    dispatch(getCurrentSelectedRoom(payload))
  }, [receiver, room, onPressMobile, dispatch])

  return (
    <Flex
      onClick={handleSelectRoom}
      gap={'10px'}
      bg={room?.id === selectedRoom?.id && bgColor}
      p={2}
      rounded="10px"
      align="center"
      cursor="pointer"
      _hover={{
        backgroundColor: `${bgColor}`
      }}
    >
      <Avatar src={receiver?.avatar} sx={{ width: '40px', height: '40px' }} />
      <Box>
        <Heading as="h3" fontSize="md">
          {receiver?.displayName}
        </Heading>
      </Box>
    </Flex>
  )
}

interface ConversationProps {
  onPressMobile?: () => void
}

const Converstation = ({ onPressMobile }: ConversationProps) => {
  const dispatch = useDispatch()
  const userLogin = useSelector((state: RootState) => state.auth.authState.user)
  const rooms = useSelector((state: RootState) => state.room.getAllRoomConversation.rooms)
  const isFetching = useSelector((state: RootState) => state.room.getAllRoomConversation.isFetching)

  useEffect(() => {
    if (userLogin?.id) {
      getAllRoomConversation(dispatch, userLogin?.id)
    }
  }, [userLogin?.id, dispatch])

  return (
    <WrapContent title="Message">
      {isFetching ? (
        <Box minH="60px" display="flex" alignItems="center" justifyContent="center">
          <Spinner />
        </Box>
      ) : !rooms.length ? (
        <EmptyState title="No rooms chat" />
      ) : (
        rooms?.map(room => {
          return <CoversItem onPressMobile={onPressMobile} senderId={userLogin?.id} key={room.id} room={room} />
        })
      )}
    </WrapContent>
  )
}

export default Converstation
