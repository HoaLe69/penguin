import { Box } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import Post from './post-item'

function PostInfor() {
  const postInfor = useSelector((state: RootState) => state.post?.currentPostInfor.post)
  return (
    <Box>
      <Post {...postInfor} isDetail />
    </Box>
  )
}

export default PostInfor
