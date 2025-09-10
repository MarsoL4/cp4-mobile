import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import './src/i18n'; // importa e inicializa o i18n
import { LightTheme, CustomDarkTheme } from './src/theme/theme';
import { useThemeMode } from './src/hooks/useThemeMode';

export default function App() {
  const { isDark } = useThemeMode();

  return (
    <PaperProvider theme={isDark ? CustomDarkTheme : LightTheme}>
      <AppNavigator />
    </PaperProvider>
  );
}