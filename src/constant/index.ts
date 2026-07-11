import { useColorModeValue } from '@chakra-ui/react'

export const COLOR_THEME = {
  BG: (): string => {
    return useColorModeValue('#fff', 'gray.700')
  },
  BG_BUTTON: (): string => {
    return useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  },
  BORDER: (): string => {
    return useColorModeValue('blackAlpha.300', 'whiteAlpha.300')
  }
}

export const hashBase64 =
  'dGhpcyBpcyB1cmwgdG8gdmVyaWZ5IHlvdXIgZW1haWwgYWRkcmVzcy5JdCBlbmNvZGUgYnkgYWxnb3JpdGhtIGJhc2U2NA'
export const forgotHash = 'dGhpcyBpcyB1cmwgdG8gcmVzZXQgcGFzc3dvcmQgZG9udCB1c2UgaXQgaG9wZSB5b3Ugc3VjY2Vzcw'
