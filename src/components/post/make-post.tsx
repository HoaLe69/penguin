import { Box, Heading, Button, Textarea, Input, FormLabel, useColorModeValue, Avatar, useToast } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import { createPost } from '@redux/api-request/posts'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { useNavigate } from 'react-router-dom'
import { EmojiKeyboard } from 'reactjs-emoji-keyboard'
import { FaRegSmile } from 'react-icons/fa'
import { editPost } from '../../redux/api-request/posts'
import { Post as PostType } from '../../redux/postSlice'
import MediaUpload from './media-upload'

interface UploadState {
  file: File | null
  type: 'video' | 'image' | null
}

interface MakePostProps {
  postDataEditMode?: PostType
}

interface FormDataState {
  thumbnail: null
  formData: {
    userId?: string
    photoUrl?: string
    description: string
    displayName?: string
    tag: string
    fileType?: 'video' | 'image' | null
  }
}

function MakePost({ postDataEditMode }: MakePostProps) {
  const toast = useToast()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useSelector((state: RootState) => state.post.createPost.isFetching)
  const isLoadingEdit = useSelector((state: RootState) => state.post.editPost.isFetching)
  const userLogin = useSelector((state: RootState) => state.auth.authState.user)
  const [err, setErr] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>({ file: null, type: null })

  const [formData, setFormData] = useState<FormDataState>({
    thumbnail: null,
    formData: {
      userId: userLogin?.id,
      photoUrl: userLogin?.avatar,
      description: postDataEditMode?.description || '',
      displayName: userLogin?.displayName,
      tag: postDataEditMode?.tag || ''
    }
  })

  useEffect(() => {
    if (err) {
      toast({
        title: 'Create Post',
        description: err,
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right'
      })
      setErr('')
    }
  }, [err])

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'tag') {
      setFormData(pre => ({
        ...pre,
        formData: { ...pre.formData, [name]: value }
      }))
    } else {
      setFormData(pre => ({
        ...pre,
        formData: { ...pre.formData, [name]: value }
      }))
    }
  }

  const handleUploadFileState = useCallback((data: UploadState) => {
    setUploadState(data)
  }, [])

  const handleSubmit = () => {
    try {
      if (!uploadState.file && formData.formData.description && !postDataEditMode) {
        setErr('You must upload image')
        return
      }
      if (!uploadState.file && !formData.formData.description) {
        setErr('empty post')
        return
      }
      const form = new FormData()
      formData.formData.fileType = uploadState.type
      const blob = new Blob([JSON.stringify(formData.formData)], {
        type: 'application/json'
      })
      if (uploadState.file) {
        form.append('file', uploadState.file)
      }
      form.append('formData', blob)
      if (postDataEditMode) {
        editPost(dispatch, form, postDataEditMode?.id as string, postDataEditMode?.cloudinaryId as string)
      } else {
        createPost(dispatch, navigate, form)
      }
    } catch (error) {
      console.log(error)
      toast({
        title: 'Create Post',
        description: 'Something went wrong',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right'
      })
    }
  }

  const handleHideEmojiKeyboard = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.emoji')) setShowEmoji(true)
    else setShowEmoji(false)
  }

  return (
    <Box pb={2} pt={2} onClick={handleHideEmojiKeyboard}>
      <Box>
        <Box display="flex" alignItems="center" gap="5px">
          <Avatar size="sm" src={userLogin?.avatar} />
          <Heading fontSize="15px">{userLogin?.displayName}</Heading>
        </Box>
        <Box position="relative">
          <Textarea
            mt={2}
            placeholder="What your on mind ?"
            bg={useColorModeValue('whiteAlpha.700', 'whiteAlpha.200')}
            resize="vertical"
            name="description"
            onChange={handleOnChange}
            value={formData.formData.description}
          />
          <Box fontSize="20px" position="absolute" right={2} bottom={2} zIndex={10} cursor="pointer" className="emoji">
            <FaRegSmile />
            <Box display={showEmoji ? 'block' : 'none'} position="absolute" top={0} right={'20px'}>
              <EmojiKeyboard
                height={320}
                width={350}
                theme={useColorModeValue('light', 'dark')}
                searchLabel="Procurar emoji"
                searchDisabled={false}
                onEmojiSelect={emoji =>
                  setFormData(pre => ({
                    ...pre,
                    formData: {
                      ...pre.formData,
                      description: pre.formData.description + emoji.character
                    }
                  }))
                }
                categoryDisabled={false}
              />
            </Box>
          </Box>
        </Box>
        <MediaUpload isEditMode={!!postDataEditMode} uploadState={uploadState} onUploadState={handleUploadFileState} />

        <FormLabel>
          HasTag
          <Input
            mt={2}
            id="input-hastag"
            type="text"
            onChange={handleOnChange}
            name="tag"
            placeholder="Write title about your post..."
            value={formData.formData.tag}
          />
        </FormLabel>
      </Box>
      <Box pt="3" display="flex" justifyContent="center">
        <Button
          isLoading={postDataEditMode ? isLoadingEdit : isLoading}
          loadingText={postDataEditMode ? 'Saving...' : 'Upload...'}
          colorScheme="teal"
          px={8}
          onClick={handleSubmit}
        >
          {postDataEditMode ? 'Save' : 'Post'}
        </Button>
      </Box>
    </Box>
  )
}

export default MakePost
