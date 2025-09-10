import { ThemeProvider } from "../src/context/ThemeContext";
import { I18nextProvider } from "react-i18next";
import i18n from "../src/services/i18n";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../src/services/queryClient";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}