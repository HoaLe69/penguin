import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  useColorModeValue
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetStatus } from '../../redux/postSlice'
import MakePost from '../post/make-post'
import { Post } from '../../redux/postSlice'
import { RootState } from '../../redux/store'

interface CreatePostModalProps {
  mode: string
  isOpen: boolean
  onClose: () => void
  postDataEditMode?: Post
}

function CreatePostModal(props: CreatePostModalProps) {
  const { mode, isOpen, onClose, postDataEditMode } = props
  const dispatch = useDispatch()
  const isCreateSuccess = useSelector((state: RootState) => state.post.createPost.success)
  const isEditSuccess = useSelector((state: RootState) => state.post.editPost.success)
  const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300')
  useEffect(() => {
    if (isCreateSuccess || isEditSuccess) {
      onClose()
    }
    return () => {
      if (isCreateSuccess || isEditSuccess) dispatch(resetStatus())
    }
  }, [isCreateSuccess, onClose, isEditSuccess, dispatch])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', lg: 'lg' }}>
      <ModalOverlay />
      <ModalContent py={0}>
        <ModalHeader textAlign="center" borderBottom="1px" borderBottomColor={borderColor}>
          {mode === 'edit' ? 'Edit post' : 'Create new post'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={0}>
          <MakePost postDataEditMode={postDataEditMode} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CreatePostModal
