import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  Box,
  useColorModeValue
} from '@chakra-ui/react'
import Comment from '../post/comment'
import Post from '../post/post-item'
import { Post as PostType } from '../../redux/postSlice'

interface FeedModalProps {
  isOpen: boolean
  onClose: () => void
  postInfo?: PostType
  handleGetAmountOfComment?: (count: number) => void
  [key: string]: unknown
}

function FeedModal(props: FeedModalProps) {
  const { isOpen, onClose, postInfo, ...postExtra } = props
  const borderColor = useColorModeValue('blackAlpha.300', 'whiteAlpha.300')
  return (
    <Modal scrollBehavior="inside" isOpen={isOpen} onClose={onClose} size={{ base: 'full', lg: '3xl' }}>
      <ModalOverlay />
      <ModalContent pb={2} px={0}>
        <ModalHeader textAlign="center" borderBottom="1px" borderBottomColor={borderColor}>
          Bài Viết Của {postInfo?.displayName}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingInlineStart={0} paddingInlineEnd={0}>
          <Box>
            <Post {...postInfo} {...postExtra} isModal />
          </Box>
          <Comment
            handleGetAmountOfComment={postExtra.handleGetAmountOfComment}
            postId={postInfo?.id}
            ownerPostId={postInfo?.userId}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default FeedModal
