import { Input, Box, InputGroup, InputRightElement, useColorModeValue } from '@chakra-ui/react'
import { BsFillSendFill } from 'react-icons/bs'
import { FaRegSmile } from 'react-icons/fa'
import { useCallback, useRef, useState } from 'react'
import { EmojiKeyboard } from 'reactjs-emoji-keyboard'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { ChatMessage } from '../../redux/conversationSlice'

interface InputRoomChatProps {
  roomId?: string
  sendMessage: <M = ChatMessage>(destination: string, message: M) => void
}

const InputRoomChat = ({ roomId, sendMessage }: InputRoomChatProps) => {
  const [content, setContent] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [showEmoji, setShowEmoji] = useState(false)
  const userLogin = useSelector((state: RootState) => state.auth.authState.user)

  const handleSendMessage = useCallback(() => {
    if (!content.trim() || !roomId) return
    const message = {
      userId: userLogin?.id,
      conversationId: roomId,
      content: content
    }
    sendMessage(`/app/messages/${roomId}`, message)
    setContent('')
    inputRef?.current?.focus()
  }, [content, roomId, userLogin?.id, sendMessage])

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage()
  }

  const handleHideEmojiKeyboard = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.emoji')) setShowEmoji(true)
    else setShowEmoji(false)
  }

  const bgInput = useColorModeValue('whiteAlpha.700', 'whiteAlpha.100')

  return (
    <Box p={3} onClick={handleHideEmojiKeyboard}>
      <Box py={2} display="flex" alignItems="center" bg={bgInput} px={2} rounded="25px">
        <Box fontSize="25px" className="emoji" cursor="pointer" position="relative">
          <FaRegSmile />
          <Box display={showEmoji ? 'block' : 'none'} position="absolute" bottom="180%">
            <EmojiKeyboard
              height={320}
              width={350}
              theme={useColorModeValue('light', 'dark')}
              searchLabel="Procurar emoji"
              searchDisabled={false}
              onEmojiSelect={(emoji: { character: string }) => setContent(pre => pre + emoji.character)}
              categoryDisabled={false}
            />
          </Box>
        </Box>
        <InputGroup px={2}>
          <Input
            autoComplete="off"
            fontSize="18px"
            ref={inputRef}
            placeholder="Message..."
            value={content}
            name="content"
            onChange={e => setContent(e.target.value)}
            onKeyDown={handleKeydown}
            variant="unstyled"
          />
          <InputRightElement>
            <Box pb={2} as="button" onClick={handleSendMessage}>
              <BsFillSendFill />
            </Box>
          </InputRightElement>
        </InputGroup>
      </Box>
    </Box>
  )
}

export default InputRoomChat
