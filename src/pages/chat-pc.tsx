import { Box, useDisclosure, Drawer, DrawerContent, DrawerBody, useColorModeValue, BoxProps } from '@chakra-ui/react'
import LayoutWithoutNav from '../layout/layout-without-nav'
import { useCallback } from 'react'
import Converstation from '@components/conversation/conversation'
import RoomConversation from '@components/conversation/room-conversation'
import NavTop from '../components/nav/nav-top'
import { COLOR_THEME } from '../constant'

const ChatPc = () => {
  const displayOnSmallScreen = { base: 'block', lg: 'none' }
  const displayOnLargeScreen = { base: 'none', lg: 'flex' }
  return (
    <>
      <ChatSmallScreen display={displayOnSmallScreen} />
      <ChatLargeScreen display={displayOnLargeScreen} />
    </>
  )
}

interface ChatSmallScreenProps extends BoxProps {
  display?: Record<string, string>
}

const ChatSmallScreen = ({ display, ...props }: ChatSmallScreenProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onPressMobile = useCallback(() => {
    onOpen()
  }, [onOpen])

  const onPressMobileBackToChatList = useCallback(() => {
    onClose()
  }, [onClose])

  const bgChat = useColorModeValue('#f0e7db', '#202023')

  return (
    <LayoutWithoutNav display={display} {...props}>
      <Converstation onPressMobile={onPressMobile} />
      <Drawer onClose={onClose} isOpen={isOpen} size={'full'}>
        <DrawerContent>
          <DrawerBody bg={bgChat} p={0} w="100vw" h="100vh" overflow="hidden">
            <RoomConversation onPressMobileBackToChatList={onPressMobileBackToChatList} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </LayoutWithoutNav>
  )
}

interface ChatLargeScreenProps extends BoxProps {
  display?: Record<string, string>
}

const ChatLargeScreen = ({ display, ...props }: ChatLargeScreenProps) => (
  <Box display={display || 'flex'} flexDir="column" justifyContent="flex-end" height="100vh" {...props}>
    <NavTop isFixed={true} />
    <Box display="flex" flex={1} overflow="hidden">
      <Box borderRightWidth={1} flex={1} borderColor={COLOR_THEME.BORDER as unknown as string}>
        <Converstation />
      </Box>
      <Box flex={3}>
        <RoomConversation />
      </Box>
    </Box>
  </Box>
)

export default ChatPc
