import { Box, Container, useColorModeValue, BoxProps } from '@chakra-ui/react'
import { COLOR_THEME } from '../../constant'
import { ReactNode } from 'react'

interface NavWrapProps extends Omit<BoxProps, 'children'> {
  children: ReactNode
  isFixed?: boolean
}

const NavWrap = ({ children, isFixed, ...props }: NavWrapProps) => {
  const borderColor = COLOR_THEME.BORDER as unknown as string
  return (
    <Box
      as="nav"
      zIndex={1}
      position={isFixed ? 'relative' : 'fixed'}
      borderBottomWidth={isFixed ? 1 : 0}
      borderColor={borderColor}
      css={{ backdropFilter: 'blur(10px)' }}
      bg={useColorModeValue('#ffffff40', '#20202380')}
      w="full"
      {...props}
    >
      <Container maxW={'container.lg'} p={2}>
        {children}
      </Container>
    </Box>
  )
}
export default NavWrap
