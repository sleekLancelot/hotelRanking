import * as React from "react"
import {
  ChakraProvider,
  Box,
  theme,
} from "@chakra-ui/react"
import { Provider } from "react-redux"

import { AllHotelsScreen } from "./features/hotels/screens"
import {store} from './redux/store'

export const App = () => (
  <ChakraProvider theme={theme}>
    <Provider store={store}>
      <Box textAlign="center" fontSize="xl">
        <AllHotelsScreen />
      </Box>
    </Provider>
  </ChakraProvider>
)
