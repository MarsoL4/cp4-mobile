import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

const themeColors = {
  light: {
    background: "#fff",
    text: "#000",
    button: "#007bff",
    buttonText: "#fff"
  },
  dark: {
    background: "#000",
    text: "#fff",
    button: "#0bf359ff",
    buttonText: "#000"
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("@theme");
      if (stored) {
        setTheme(stored as Theme);
      } else {
        const sysColorScheme = Appearance.getColorScheme() as Theme;
        setTheme(sysColorScheme || "light");
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("@theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: themeColors[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}