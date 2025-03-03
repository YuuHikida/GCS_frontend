'use client'

import { ChakraProvider, baseTheme } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'

export function Provider(props) {
  return (
    <ChakraProvider value={baseTheme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
