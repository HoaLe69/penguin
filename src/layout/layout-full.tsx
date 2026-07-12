import { ReactNode } from 'react'
import NavTop from '@components/nav/nav-top'
import NavBot from '@components/nav/nav-bot'
import { Box, Container } from '@chakra-ui/react'

interface LayoutFullProps {
  children: ReactNode
}

function LayoutFull({ children }: LayoutFullProps) {
  return (
    <Box overflow="hidden" height="100vh" overflowY="overlay">
      <NavTop isFixed={false} />
      <Container maxW={'container.sm'} px={0} pt={14} pb={20}>
        {children}
      </Container>
      <NavBot />
    </Box>
  )
}

export default LayoutFull
