import { MD3LightTheme as DefaultTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';

export const LightTheme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1976D2',
    secondary: '#FFC107',
    background: '#fff',
    onBackground: '#000',
  },
};

export const CustomDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#1976D2',
    secondary: '#FFC107',
    background: '#121212',
    onBackground: '#fff',
  },
};