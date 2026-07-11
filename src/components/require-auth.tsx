import { ReactNode, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { verifyUser } from '../redux/api-request/user'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import ChatFloat from './chat-float/chat-float'

interface RequireAuthenticationProps {
  children: ReactNode
}

function RequireAuthentication({ children }: RequireAuthenticationProps) {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(state => state.auth.authState.isAuthenticated)
  const { pathname } = useLocation()

  useEffect(() => {
    verifyUser(dispatch)
  }, [])

  if (isAuthenticated === false) return <Navigate to="/login" replace={true} />

  return (
    <>
      {children}
      {pathname !== '/chat' && <ChatFloat />}
    </>
  )
}

export default RequireAuthentication
