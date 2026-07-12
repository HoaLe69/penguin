import { Box, Heading, Image } from '@chakra-ui/react'
import images from '../../assets'

const EmptyRoom = () => {
  return (
    <Box display="flex" flexDir="column" alignItems="center" w="100%" justifyContent="center">
      <Image src={images.emptyRoom} alt="this is empty room" />
      <Heading>Chưa chọn đoạn chat nào</Heading>
    </Box>
  )
}

export default EmptyRoom
