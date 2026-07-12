import { ReactNode } from 'react'
import { Container, Box } from '@chakra-ui/react'
import NavTop from '@components/nav/nav-top'

interface LayoutOnlyHeaderProps {
  children: ReactNode
}

function LayoutOnlyHeader({ children }: LayoutOnlyHeaderProps) {
  return (
    <Box>
      <NavTop isFixed={true} />
      <Container maxW="container.lg">{children}</Container>
      asdjklhajksd
    </Box>
  )
}

export default LayoutOnlyHeader
