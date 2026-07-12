import { Link as ReactRouterLink } from 'react-router-dom'
import { Text, Link, useColorModeValue, LinkProps } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { AiOutlineQq } from 'react-icons/ai'
import { ReactNode } from 'react'

const LogoBox = styled.span`
  font-weight: bold;
  font-size: 20px;
  display: inline-flex;
  align-items: center;
  padding: 10px 0;
  line-height: 20px;
`

interface LogoProps extends Omit<LinkProps, 'children'> {
  onClick?: () => void
}

const Logo = ({ onClick, ...props }: LogoProps) => {
  return (
    <Link as={ReactRouterLink} to={'/'} {...props}>
      <LogoBox onClick={onClick}>
        <AiOutlineQq />
        <Text
          color={useColorModeValue('gray.800', 'whiteAlpha.900')}
          fontWeight={'bold'}
          ml={1}
          fontFamily={`'M PLUS Rounded 1c' , san-serif`}
        >
          Penguin Hup
        </Text>
      </LogoBox>
    </Link>
  )
}
export default Logo
