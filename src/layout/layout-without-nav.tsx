import { ReactNode } from 'react'
import { Box, BoxProps, Container } from '@chakra-ui/react'

interface LayoutWithoutNavProps extends BoxProps {
  children: ReactNode
}

function LayoutWithoutNav({ children, ...props }: LayoutWithoutNavProps) {
  return (
    <Box overflow="hidden" height="100vh" overflowY="overlay" {...props}>
      <Container maxW="container.lg" pb={2}>
        {children}
      </Container>
    </Box>
  )
}

export default LayoutWithoutNav
