import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Heading,
  FormControl,
  FormLabel,
  Stack,
  Textarea,
  Avatar,
  VStack
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { updateUser } from '../../redux/api-request/user'
import { RootState } from '../../redux/store'

interface EditProfileValues {
  about: string
}

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

function EditProfileModal(props: EditProfileModalProps) {
  const { isOpen, onClose } = props
  const dispatch = useDispatch()
  const userLogin = useSelector((state: RootState) => state.auth.authState.user)
  const isLoading = useSelector((state: RootState) => state.user.updateUser.isFetching)
  const formik = useFormik<EditProfileValues>({
    initialValues: {
      about: ''
    },
    onSubmit: async data => {
      if (!data.about.trim() || !userLogin?.id) return
      const updateInfo = {
        id: userLogin.id,
        ...data
      }
      await updateUser(dispatch, updateInfo)
      onClose()
    }
  })
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', lg: 'lg' }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="20px">Edit your profile</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <Avatar src={userLogin?.avatar} cursor="pointer" size="xl" />
            <Heading fontSize="15px">{userLogin?.displayName}</Heading>
          </VStack>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel htmlFor="about">Bio</FormLabel>
                <Textarea
                  onChange={formik.handleChange}
                  value={formik.values.about}
                  name="about"
                  id="about"
                  placeholder="Enter your about..."
                />
              </FormControl>
            </Stack>
            <ModalFooter>
              <Button type="submit" isLoading={isLoading} loadingText="saving" colorScheme="teal" mr={3}>
                Save
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default EditProfileModal
