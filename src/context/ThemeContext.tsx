import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    text: string;
    button: string;
    buttonText: string;
  };
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

const themeColors = {
  light: {
    background: "#ffffff",
    text: "#000000",
    button: "#007bff",
    buttonText: "#ffffff",
  },
  dark: {
    background: "#121212",
    text: "#ffffff",
    button: "#0bf359",
    buttonText: "#000000",
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("@theme");
        if (stored === "light" || stored === "dark") setTheme(stored as Theme);
        else setTheme((Appearance.getColorScheme() as Theme) || "light");
      } catch (e) {
        setTheme("light");
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("@theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: themeColors[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}
