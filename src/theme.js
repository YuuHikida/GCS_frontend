// theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        color: "gray.800",
        lineHeight: "tall",
        backgroundColor: "gray.50",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        textTransform: "uppercase",
        borderRadius: "lg",
      },
      variants: {
        solid: {
          bg: "teal.400",
          color: "white",
          _hover: {
            bg: "teal.500",
          },
        },
      },
    },
  },
});

export default theme;