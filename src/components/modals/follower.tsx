import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  Avatar,
  Heading,
  HStack,
  useColorModeValue,
  Link
} from '@chakra-ui/react'
import { Link as ReacRouterLink } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getListFollower } from '@redux/api-request/user'
import { RootState } from '../../redux/store'
import { User } from '../../redux/authSlice'

interface ListFollowerModalProps {
  isOpen: boolean
  onClose: () => void
  listsUserIdFollower?: string[]
}

function ListFollowerModal(props: ListFollowerModalProps) {
  const { isOpen, onClose, listsUserIdFollower } = props
  const dispatch = useDispatch()
  const listFollower = useSelector((state: RootState) => state.user.getListUserFollower?.listFollower)

  useEffect(() => {
    if (!isOpen) return
    if (listsUserIdFollower) {
      getListFollower(dispatch, listsUserIdFollower)
    }
  }, [dispatch, isOpen, listsUserIdFollower])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Follower</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {listFollower?.map(user => {
            return <UserItem onClose={onClose} user={user} key={user?.id} />
          })}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

interface UserItemProps {
  user: User
  onClose: () => void
}

function UserItem(props: UserItemProps) {
  const { user, onClose } = props
  return (
    <Link _hover={{ textDecoration: 'none' }} onClick={onClose} as={ReacRouterLink} to={`/profile/${user?.id}`}>
      <HStack
        p={2}
        cursor="pointer"
        rounded="10px"
        _hover={{
          backgroundColor: `${useColorModeValue('blackAlpha.200', 'whiteAlpha.300')}`
        }}
      >
        <Avatar src={user?.avatar} name={user?.displayName} />
        <Heading as="h4" fontSize="14px">
          {user?.displayName}
        </Heading>
      </HStack>
    </Link>
  )
}

export default ListFollowerModal
