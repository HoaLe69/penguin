import { Button } from '@chakra-ui/react'
import GoogleIcon from './icons/GoogleIcon'
import { useGoogleLogin } from '@react-oauth/google'
import { useCallback } from 'react'
import React from 'react'

interface GoogleButtonLoginProps {
  title: string
}

const GoogleButtonLogin: React.FC<GoogleButtonLoginProps> = ({ title }) => {
  const googleAuthorizeURL = useCallback((token: string) => {
    return `${process.env.REACT_APP_GOOGLE_AUTHORIZE_URL}/login/redirect/google?code=${token}`
  }, [])

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {
      window.location.assign(googleAuthorizeURL(tokenResponse?.access_token))
    }
  })

  const handleClick = () => {
    handleGoogleLogin()
  }

  return (
    <Button gap={2} width="full" onClick={handleClick}>
      <GoogleIcon />
      {title}
    </Button>
  )
}

export default GoogleButtonLogin
