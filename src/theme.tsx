import { extendTheme } from '@chakra-ui/react';

const breakpoints = {
  sm: '480px',
  md: '632px',
  lg: '992px',
  xl: '1280px',
  '2xl': '1536px',
};

export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
  colors: {
    primary: {
      50: '#efeaff',
      100: '#ccc2f3',
      200: '#aa9ce5',
      300: '#8874d9',
      400: '#664ccc', // main color
      500: '#4c33b3',
      600: '#3b278c',
      700: '#291b65',
      800: '#18103f',
      900: '#08051b',
    },
  },
  semanticTokens: {
    colors: {
      'active-menu-item-bg': {
        _dark: 'gray.600',
        _light: 'gray.200',
      },
      'chakra-body-bg': {
        _dark: '#2c2c2c',
      },
    },
  },
  breakpoints,
  sizes: {
    container: breakpoints,
  },
  styles: {
    global: {
      '*, *::before, *::after': {
        boxSizing: 'border-box',
      },
      a: {
        textUnderlineOffset: '2px',
      },
    },
  },
});
