import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useThemeMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('theme').then((mode) => {
      setIsDark(mode === 'dark');
    });
  }, []);

  const toggleTheme = async () => {
    const newMode = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    await AsyncStorage.setItem('theme', newMode);
  };

  return { isDark, toggleTheme };
};