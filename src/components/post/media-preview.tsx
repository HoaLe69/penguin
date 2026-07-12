import { useEffect, useRef } from 'react'
import { Box, Image } from '@chakra-ui/react'

interface MediaPreviewProps {
  file: File
  type: 'video' | 'image' | null
}

function MediaPreview({ file, type }: MediaPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file)

    if (type === 'video' && videoRef.current) {
      videoRef.current.src = objectUrl
    } else if (type === 'image' && imageRef.current) {
      imageRef.current.src = objectUrl
    }
    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [file, type])

  if (type === 'video') {
    return (
      <Box width="100%" borderRadius="md" overflow="hidden">
        <video ref={videoRef} width="100%" controls playsInline preload="metadata" />
      </Box>
    )
  }
  return (
    <Box width="100%" maxH="400px" borderRadius="md" overflow="hidden">
      <Image ref={imageRef} width="100%" maxH="400px" objectFit="cover" alt="preview" />
    </Box>
  )
}

export default MediaPreview
