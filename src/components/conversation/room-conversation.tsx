import { Box, Text, Flex, Avatar, Heading, useColorModeValue, Spinner } from '@chakra-ui/react'
import { AiOutlineLeft } from 'react-icons/ai'
import { COLOR_THEME } from '../../constant'
import { useSelector } from 'react-redux'
import EmptyRoom from './room-empty'
import Message from './message'
import { useStompClient } from '../../hooks/useWebSocket'
import { useEffect, useRef, useState, useCallback } from 'react'
import InputRoomChat from './input-mess'
import axiosClient from '../../config/axios'
import { ChatMessage } from '../../redux/conversationSlice'
import { RootState } from '../../redux/store'

interface RoomConversationProps {
  onPressMobileBackToChatList?: () => void
}

// STOMP topic payload envelope: the server publishes the actual chat message
// under a `body` key (matches existing runtime behavior, unchanged here).
interface IncomingChatMessageEvent {
  body: ChatMessage
}

const RoomConversation = ({ onPressMobileBackToChatList }: RoomConversationProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const refDiv = useRef<HTMLDivElement>(null)

  const selectedRoom = useSelector((state: RootState) => state.room.selectedRoom.info)
  const receiver = useSelector((state: RootState) => state.room.selectedRoom.receiver)

  const handleIncomingMessage = useCallback((message: IncomingChatMessageEvent) => {
    setMessages(pre => [...pre, message.body])
  }, [])

  const { sendMessage } = useStompClient<IncomingChatMessageEvent>(
    '/topic/messages',
    selectedRoom?.id,
    handleIncomingMessage
  )

  const bgHeader = useColorModeValue('#ffffff40', '#20202380')

  // COLOR_THEME.BORDER is a hook that other still-untyped call sites across the app
  // also pass unwrapped - preserved as-is to avoid an unrelated behavior change; cast silences stricter TS.
  const borderColor = COLOR_THEME.BORDER as unknown as string

  useEffect(() => {
    if (refDiv.current) refDiv.current.scrollTop = refDiv.current.scrollHeight
  }, [messages])

  useEffect(() => {
    const loadMessageHistory = async () => {
      setLoading(true)
      try {
        const res = await axiosClient.get<ChatMessage[]>(`/message/all/${selectedRoom?.id}`)
        setMessages(res)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    if (selectedRoom?.id) loadMessageHistory()
  }, [selectedRoom?.id])

  return (
    <>
      {selectedRoom ? (
        <Box display="flex" h="full" flexDir="column">
          <Flex
            as="header"
            gap="10px"
            align="center"
            borderBottomWidth={1}
            borderColor={borderColor}
            py={2}
            css={{ backdropFilter: 'blur(10px)' }}
            bg={bgHeader}
          >
            <Box onClick={onPressMobileBackToChatList} display={{ lg: 'none', base: 'block' }}>
              <Box fontSize="20px">
                <AiOutlineLeft />
              </Box>
            </Box>
            <Avatar ml={2} src={receiver?.avatar} size="sm" name={receiver?.displayName} />
            <Heading as="h3" fontSize="16px">
              {receiver?.displayName}
            </Heading>
          </Flex>
          <Box flex="1" display="flex" flexDir="column" overflowY="auto" overflowX="hidden" p={2} ref={refDiv}>
            <Box display="flex" flexDir="column" alignItems="center" mb={20}>
              <Avatar src={receiver?.avatar} size="xl" name={receiver?.displayName} />
              <Text color="gray.500">Let chat with {receiver?.displayName}</Text>
            </Box>
            <Box pb={12}>
              {loading ? (
                <Box display="flex" alignItems="center" justifyContent="center" minH="100px">
                  <Spinner />
                </Box>
              ) : (
                messages.map((message, index) => {
                  return (
                    <Message
                      roomId={selectedRoom?.id}
                      key={message?.id || index}
                      receiver={receiver ?? undefined}
                      avatar={receiver?.avatar}
                      {...message}
                    />
                  )
                })
              )}
            </Box>
          </Box>
          <InputRoomChat roomId={selectedRoom.id} sendMessage={sendMessage} />
        </Box>
      ) : (
        <EmptyRoom />
      )}
    </>
  )
}

export default RoomConversation
