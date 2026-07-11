import { Text, Avatar, Box, Flex, Heading, IconButton, Link, useColorModeValue, Spinner } from '@chakra-ui/react'
import { IoMdClose } from 'react-icons/io'
import { COLOR_THEME } from '../../constant'
import InputRoomChat from '../conversation/input-mess'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import Message from '../conversation/message'
import { useStompClient } from '../../hooks/useWebSocket'
import { Link as ReactRouterLink } from 'react-router-dom'
import { useAppDispatch } from '../../redux/hooks'
import { closeRoomFloat, ChatMessage, RoomInfo, RoomMember } from '../../redux/conversationSlice'
import axiosClient from '../../config/axios'

interface ChatFloatRoomProps {
  room: RoomInfo
  receiver: RoomMember
}

// STOMP topic payload envelope: the server publishes the actual chat message
// under a `body` key (matches existing runtime behavior, unchanged here).
interface IncomingChatMessageEvent {
  body: ChatMessage
}

const ChatFloatRoom = ({ room, receiver }: ChatFloatRoomProps) => {
  const dispatch = useAppDispatch()
  const refDiv = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState<boolean | null>(null)

  // COLOR_THEME.BORDER is a hook (`() => string`) that other still-untyped call sites
  // across the app also pass unwrapped (i.e. without invoking it) - preserved as-is here
  // to avoid an unrelated behavior change; cast only silences the stricter TS prop type.
  const borderColor = COLOR_THEME.BORDER as unknown as string

  //  const userLogin = useSelector(state => state.auth.authState.user)

  const handleIncomingMessage = useCallback((message: IncomingChatMessageEvent) => {
    setMessages(pre => [...pre, message.body])
  }, [])

  const { sendMessage } = useStompClient<IncomingChatMessageEvent>('/topic/messages', room?.id, handleIncomingMessage)

  const handleOnClickCloseRoom = useCallback(() => {
    dispatch(closeRoomFloat(room?.id))
  }, [room])

  const loadMessageHistory = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axiosClient.get<ChatMessage[]>(`/message/all/${room?.id}`)
      setMessages(pre => [...pre, ...res])
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (room?.id) loadMessageHistory()
  }, [room?.id])

  useEffect(() => {
    const containerEl = refDiv.current
    if (containerEl) {
      containerEl.scrollTop = containerEl.scrollHeight
    }
  }, [messages])
  return (
    <Box
      w="328px"
      border="1px"
      borderColor={borderColor}
      roundedTop="10px"
      h="450px"
      boxShadow="lg"
      bg={useColorModeValue('#f0e7db', '#202023')}
    >
      <Flex as="header" borderBottom="1px" borderColor={borderColor} alignItems="center" gap={2} p={2}>
        <Link
          display="flex"
          alignItems="center"
          gap="5px"
          _hover={{ textDecoration: 'none' }}
          as={ReactRouterLink}
          to={`/profile/${receiver?.id}`}
        >
          <Avatar size="sm" src={receiver?.avatar} />
          <Heading fontSize={'13px'}>{receiver?.displayName}</Heading>
        </Link>
        <IconButton
          aria-label="Close chat"
          onClick={handleOnClickCloseRoom}
          ml="auto"
          rounded="full"
          size="sm"
          icon={<IoMdClose />}
        ></IconButton>
      </Flex>
      <Box display="flex" flexDir="column" sx={{ height: 'calc(100% - 50px )' }} justifyContent="end">
        <Box p={2} overflowX={'hidden'} display="flex" flexDir="column" maxH="100%" overflowY="auto" ref={refDiv}>
          <Box display="flex" flexDir="column" alignItems="center" mb={20}>
            <Avatar src={receiver?.avatar} size="md" name={receiver?.displayName} />
            <Text color="gray.500">Let chat with {receiver?.displayName}</Text>
          </Box>
          <Box width="full" display="flex" alignItems="center" justifyContent="center">
            {loading && <Spinner />}
          </Box>
          <Box>
            {messages?.map((message, index) => {
              return <Message {...message} receiver={receiver} key={message?.id || index} roomId={room?.id} isFloat />
            })}
          </Box>
        </Box>
        <InputRoomChat roomId={room?.id} sendMessage={sendMessage} />
      </Box>
    </Box>
  )
}

export default memo(ChatFloatRoom)
