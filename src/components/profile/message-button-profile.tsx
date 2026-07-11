import { Button, Spinner, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { useAppDispatch } from '@redux/hooks'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../../config/axios'
import { getCurrentSelectedRoom, RoomInfo } from '../../redux/conversationSlice'
import { User } from '../../redux/authSlice'

interface GotoChatButtonProps {
  member: string[]
  receiver: User | null | undefined
}

function GotoChatButton(props: GotoChatButtonProps) {
  const { member, receiver } = props
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [senderId, receiveId] = member

  const handleGoToRoomChat = async () => {
    try {
      if (senderId && receiveId) {
        setLoading(true)
        const room = await axiosClient.get<RoomInfo | null>(`/conversation/find/${senderId}/${receiveId}`)
        if (room?.id) {
          dispatch(getCurrentSelectedRoom({ info: room, receiver }))
        } else {
          const res = await axiosClient.post<RoomInfo>(`/conversation/create`, { member: member })
          dispatch(getCurrentSelectedRoom({ info: res, receiver }))
        }
        navigate('/chat')
      } else {
        throw new Error('Something went wrong')
      }
    } catch (err) {
      toast({
        position: 'bottom-right',
        title: 'Message',
        description: 'Something went wrong',
        duration: 1500
      })
      console.log(err)
    } finally {
      setLoading(false)
    }
  }
  return <Button onClick={handleGoToRoomChat}>{loading ? <Spinner /> : 'Messages'}</Button>
}

export default GotoChatButton
