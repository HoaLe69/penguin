import { Menu, MenuButton, MenuList, MenuItem, IconButton, Button, useDisclosure } from '@chakra-ui/react'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { AiFillDelete } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { FaEdit } from 'react-icons/fa'
import CreatePostModal from './modals/create'
import React from 'react'
import type { Post } from '../redux/postSlice'
import type { RootState } from '../redux/store'

interface MenuPostProps {
  postInfo: Post
  onDelete: () => void
}

const MenuPost: React.FC<MenuPostProps> = ({ postInfo, onDelete }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const isLoading = useSelector((state: RootState) => state.post.deletePost.isFetching)
  const isLoadingEdit = useSelector((state: RootState) => state.post.editPost.isFetching)

  return (
    <Menu placement="bottom-end" closeOnSelect={false}>
      <MenuButton rounded="full" as={IconButton} icon={<BiDotsHorizontalRounded />} />
      <MenuList>
        <MenuItem leftIcon={<AiFillDelete />} isLoading={isLoading} loadingText="delete" as={Button} onClick={onDelete}>
          Delete post
        </MenuItem>
        <MenuItem
          leftIcon={<FaEdit />}
          isLoading={isLoadingEdit}
          loadingText="Editting..."
          as={Button}
          onClick={onOpen}
        >
          Edit Post
        </MenuItem>
      </MenuList>
      {isOpen && <CreatePostModal postDataEditMode={postInfo} isOpen={isOpen} mode="edit" onClose={onClose} />}
    </Menu>
  )
}

export default MenuPost
