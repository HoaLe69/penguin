import { useCallback, useEffect, useRef, useState } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

export const useStompClient = <T = unknown>(
  topic: string,
  id: string | undefined,
  onMessageReceived?: (msg: T) => void
) => {
  const [isConnected, setIsConnected] = useState(false)
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    if (!id) return

    const client = new Client({
      webSocketFactory: () => new SockJS(`${process.env.REACT_APP_SOCKET_URL}`),
      reconnectDelay: 5000,
      debug: () => {}
    })

    client.onConnect = () => {
      setIsConnected(true)
      client.subscribe(`${topic}/${id}`, message => {
        if (onMessageReceived) {
          onMessageReceived(JSON.parse(message.body) as T)
        }
      })
    }

    client.onStompError = frame => {
      console.log('Connection error: ', frame)
    }

    client.onWebSocketClose = () => {
      setIsConnected(false)
    }

    client.activate()
    clientRef.current = client

    //Cleanup on unmount
    return () => {
      client.deactivate()
      clientRef.current = null
      setIsConnected(false)
    }
  }, [id, onMessageReceived])

  const sendMessage = useCallback(
    <M = T>(destination: string, message: M) => {
      if (clientRef.current && isConnected) {
        clientRef.current.publish({ destination, body: JSON.stringify(message) })
      } else {
        console.warn('Client is not connected')
      }
    },
    [isConnected]
  )

  return { sendMessage, isConnected }
}
