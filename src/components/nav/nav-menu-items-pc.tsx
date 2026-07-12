import {
  Box,
  Text,
  Tooltip,
  Avatar,
  useColorModeValue,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem
} from '@chakra-ui/react'
import { AiFillMessage } from 'react-icons/ai'
import { BsPatchPlusFill } from 'react-icons/bs'
import CreatePostModal from '../modals/create'
import ToggleThemeButton from '../theme-toggle-btn'
import { COLOR_THEME } from '../../constant'
import { BiLogOut } from 'react-icons/bi'
import { CgProfile } from 'react-icons/cg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ListConversation from '../chat-float/room-float'
import axiosClient from '../../config/axios'
import { useAppSelector } from '@redux/hooks'
import { ReactNode } from 'react'

interface MenuItemPcProps {
  icon: ReactNode
  onOpen?: () => void
}

const MenuItemPc = ({ icon, onOpen }: MenuItemPcProps) => {
  const bgButton = COLOR_THEME.BG_BUTTON as unknown as string
  return (
    <Box onClick={onOpen} cursor="pointer" rounded="full" fontSize={'22px'} bg={bgButton} p={3}>
      {icon}
    </Box>
  )
}

const NavMenuPc = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const userLogin = useAppSelector(state => state.auth.authState.user)
  const bgColor = COLOR_THEME.BG as unknown as string

  const handleLogOut = async () => {
    try {
      await axiosClient.get(`/auth/log-out/${userLogin?.userName}`)
      navigate('/login')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Box display={{ base: 'none', lg: 'flex' }} alignItems="center" gap="10px">
      <Box>
        <MenuItemPc icon={<BsPatchPlusFill />} onOpen={onOpen} />
        <CreatePostModal mode="create" isOpen={isOpen} onClose={onClose} />
      </Box>
      <Menu placement="bottom">
        {({ isOpen: menuIsOpen }) => (
          <>
            <Tooltip label="message">
              <MenuButton
                display={pathname.includes('/chat') ? 'none' : 'block'}
                sx={{ '&[aria-expanded=true]': { color: 'grassTeal' } }}
              >
                <MenuItemPc icon={<AiFillMessage />} />
              </MenuButton>
            </Tooltip>
            <MenuList bg={bgColor} width={'md'} maxH="60vh">
              <Box>
                <ListConversation isOpen={menuIsOpen} />
              </Box>
            </MenuList>
          </>
        )}
      </Menu>
      <Menu placement="auto">
        <Tooltip label="account">
          <MenuButton>
            <Avatar
              cursor="pointer"
              borderWidth={2}
              borderStyle="solid"
              borderColor={useColorModeValue('gray.500', 'whiteAlpha.500')}
              size={'md'}
              src={userLogin?.avatar}
            />
          </MenuButton>
        </Tooltip>
        <MenuList>
          <MenuGroup title="Profile">
            <Link to={`/profile/${userLogin?.id}`}>
              <MenuItem>
                <Box as="span" fontSize="lg" mr={2}>
                  <CgProfile />
                </Box>
                <Text> My Profile</Text>
              </MenuItem>
            </Link>
            <MenuItem onClick={handleLogOut}>
              <Box as="span" fontSize="lg" mr={2}>
                <BiLogOut />
              </Box>
              Log out
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
      <ToggleThemeButton />
    </Box>
  )
}

export default NavMenuPc
