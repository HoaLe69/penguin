import { Box, Heading, Image } from '@chakra-ui/react'
import React from 'react'
import images from '../assets'

interface EmptyStateProps {
  title: string
}

const EmptyState: React.FC<EmptyStateProps> = ({ title }) => {
  return (
    <Box display="flex" flexDir="column" alignItems="center" justifyContent="center" w="100%">
      <Image src={images.emptyRoom} alt="penguin" />
      <Heading>{title}</Heading>
    </Box>
  )
}

export default EmptyState
