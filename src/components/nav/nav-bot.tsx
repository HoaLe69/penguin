import { Flex, Link, useColorModeValue, Text, useDisclosure, Box } from '@chakra-ui/react'
import NavWrap from './nav-wrap'
import ToggleThemeButton from '../theme-toggle-btn'
import { GoHomeFill, GoHome } from 'react-icons/go'
import { NavLink as ReactRouterLink, useLocation } from 'react-router-dom'
import { BsFillPersonFill, BsFillPatchPlusFill, BsPerson, BsPatchPlus } from 'react-icons/bs'
import route from '@config/route'
import { useAppSelector } from '@redux/hooks'
import CreatePostModal from '../modals/create'
import { ReactNode } from 'react'

interface MenuItem {
  icon: ReactNode
  href: string
  activeIcon: ReactNode
  title: string
  onClick?: () => void
}

interface MenuItemProps {
  activeIcon: ReactNode
  icon: ReactNode
  href: string
  title?: string
  onClick?: () => void
}

const MenuItem = ({ activeIcon, icon, href, title, onClick }: MenuItemProps) => {
  const { pathname } = useLocation()
  const inactiveColor = useColorModeValue('gray.800', 'whiteAlpha.900')
  const active = href === pathname

  return (
    <Link
      as={ReactRouterLink}
      to={href}
      onClick={onClick}
      _hover={{ textDecoration: 'none' }}
      display={'flex'}
      flexDir={'column'}
      alignItems={'center'}
      position="relative"
    >
      <Box
        fontSize={title ? '25px' : '30px'}
        color={active ? 'grassTeal' : inactiveColor}
        _before={{
          top: '-10px',
          position: 'absolute',
          content: '""',
          width: '45px',
          borderRadius: '20px',
          height: '2px',
          display: 'inline-block',
          bg: `${active ? 'grassTeal' : 'transparent'}`
        }}
      >
        {active ? activeIcon : icon}
      </Box>
      {title && (
        <Text as="p" fontSize={'12px'} fontFamily={`'M PLUS Rounded 1c' , san-serif`}>
          {title}
        </Text>
      )}
    </Link>
  )
}

const NavBot = () => {
  const userLogin = useAppSelector(state => state.auth.authState.user)
  const { isOpen, onClose, onOpen } = useDisclosure()

  const menu: MenuItem[] = [
    {
      icon: <GoHome />,
      href: route.home,
      activeIcon: <GoHomeFill />,
      title: 'Home'
    },
    {
      icon: <BsPatchPlus />,
      href: route.makePost,
      activeIcon: <BsFillPatchPlusFill />,
      title: 'Create',
      onClick: onOpen
    },
    {
      icon: <BsPerson />,
      href: `/profile/${userLogin?.id}`,
      activeIcon: <BsFillPersonFill />,
      title: 'Profile'
    }
  ]

  return (
    <NavWrap bottom={0} display={{ lg: 'none' }}>
      <Flex align="center" justify="space-evenly">
        {menu?.map((item, index) => {
          return (
            <MenuItem
              key={index}
              activeIcon={item.activeIcon}
              icon={item.icon}
              href={item.href}
              title={item.title}
              onClick={item?.onClick}
            />
          )
        })}
        <ToggleThemeButton />
      </Flex>
      {isOpen && <CreatePostModal mode="create" isOpen={isOpen} onClose={onClose} />}
    </NavWrap>
  )
}

export default NavBot
