// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "../src/context/ThemeContext";
import { AuthProvider } from "../src/context/AuthContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../src/services/queryClient";
import { I18nextProvider } from "react-i18next";
import i18n from "../src/services/i18n";
import { Provider as PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <PaperProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
              </Stack>
            </PaperProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
