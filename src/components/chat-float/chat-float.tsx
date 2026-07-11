import { Box } from '@chakra-ui/react'
import ChatFloatRoom from './chat-float-room'
import { useAppSelector } from '../../redux/hooks'
import { memo } from 'react'

function ChatFloat() {
  const rooms = useAppSelector(state => state.room.roomFloatSelect.rooms)

  return (
    <Box position="fixed" display={{ base: 'none', lg: 'flex' }} gap={5} bottom={0} right={10}>
      {rooms?.map((room, index) => {
        return <ChatFloatRoom key={room?.info?.id || index} room={room.info} receiver={room?.receiver} />
      })}
    </Box>
  )
}

export default memo(ChatFloat)
