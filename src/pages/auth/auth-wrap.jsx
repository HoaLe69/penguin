import images from '../../assets'
import { Box, Image, keyframes } from '@chakra-ui/react'
import { motion } from 'framer-motion'

export const animationKeyFrames = keyframes`
  0% { transform : translateY(50px) ; opacity : 0;}
  100% {transform : translateY(0); opacity : 1;}
`
const animation = `${animationKeyFrames} 1s ease `

const AuthWrap = ({ children }) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100vh" overflow="hidden" gap="40px">
      <Box display={{ base: 'none', lg: 'block' }}>
        <Image boxSize="600px" objectFit="contain" src={images.auth} alt="auth banner" />
      </Box>
      <Box as={motion.div} animation={animation}>
        {children}
      </Box>
    </Box>
  )
}

export default AuthWrap
