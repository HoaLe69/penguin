interface AxiosConfig {
  headers: {
    Authorization: string
  }
}

const AccessToken = (): string | undefined => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user)?.accessToken : undefined
}

export const config: AxiosConfig = {
  headers: {
    Authorization: 'Bearer ' + AccessToken()
  }
}
