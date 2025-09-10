import { DefaultTheme, DarkTheme, Theme } from 'react-native-paper';

export const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1976D2',
    accent: '#FFC107',
    background: '#fff',
    text: '#000',
  },
};

export const CustomDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#1976D2',
    accent: '#FFC107',
    background: '#121212',
    text: '#fff',
  },
};