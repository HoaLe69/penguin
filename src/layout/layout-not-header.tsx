import { ReactNode } from 'react'
import NavBot from '@components/nav/nav-bot'
import { Box, BoxProps, Container } from '@chakra-ui/react'

interface LayoutNotHeaderProps extends BoxProps {
  children: ReactNode
}

function LayoutNotHeader({ children, ...props }: LayoutNotHeaderProps) {
  return (
    <Box {...props} overflow="hidden" height="100vh" overflowY="overlay">
      <Container maxW={'container.lg'} pb={20} px={0}>
        {children}
      </Container>
      <NavBot />
    </Box>
  )
}

export default LayoutNotHeader
