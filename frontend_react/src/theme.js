// theme.js
import { extendTheme } from '@chakra-ui/react';

const customTheme = extendTheme({
    colors: {
        primary: {
            50: "#EBF8FF",
            100: "#E3F2F9",
            200: "#C5E4F3",
            300: "#A2D4EC",
            400: "#7AC1E4",
            500: "#47A9DA",
            600: "#0088CC",
            700: "#007AB8",
            800: "#006BA1",
            900: "#005885",
        },
        secondary: {
            50: "#F0FFF4",
            100: "#C6F6D5",
            200: "#9AE6B4",
            300: "#68D391",
            400: "#48BB78",
            500: "#38A169",
            600: "#2F855A",
            700: "#276749",
            800: "#22543D",
            900: "#1C4532",
        },
        success: {
            50: "#F0FFF4",
            100: "#C6F6D5",
            200: "#9AE6B4",
            300: "#68D391",
            400: "#48BB78",
            500: "#38A169",
            600: "#2F855A",
            700: "#276749",
            800: "#22543D",
            900: "#1C4532",
        },
        warning: {
            50: "#FFFFF0",
            100: "#FEFCBF",
            200: "#FAF089",
            300: "#F6E05E",
            400: "#ECC94B",
            500: "#D69E2E",
            600: "#B7791F",
            700: "#975A16",
            800: "#744210",
            900: "#5F370E",
        },
        danger: {
            50: "#FFF5F5",
            100: "#FED7D7",
            200: "#FEB2B2",
            300: "#FC8181",
            400: "#F56565",
            500: "#E53E3E",
            600: "#C53030",
            700: "#9B2C2C",
            800: "#822727",
            900: "#63171B",
      },
        // Add more custom color schemes if needed
    },
    // Add other customizations if needed
});

export default customTheme;
