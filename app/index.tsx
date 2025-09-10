import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { useTheme } from "../src/context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function LoginScreen() {
  const { signInWithEmail, signInWithGoogle, user, loading } = useAuth();
  const { theme, toggleTheme, colors } = useTheme();
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user && !loading) {
      router.replace("/HomeScreen"); 
    }
  }, [user, loading]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }
    try {
      await signInWithEmail(email, password);
    } catch (error: any) {
      Alert.alert("Erro", error.message || String(error));
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 28, textAlign: "center", marginBottom: 24, color: colors.text }}>
        {t("login")}
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 16 }}>
        <Button mode="outlined" onPress={() => i18n.changeLanguage("pt")}>PT</Button>
        <Button mode="outlined" onPress={() => i18n.changeLanguage("en")}>EN</Button>
        <Button mode="contained" style={{ marginLeft: 8 }} onPress={toggleTheme}>
          {theme === "dark" ? "🌙" : "☀️"}
        </Button>
      </View>

      <TextInput label={t("email")} value={email} onChangeText={setEmail} style={{ marginBottom: 16 }} />
      <TextInput label={t("password")} value={password} onChangeText={setPassword} secureTextEntry style={{ marginBottom: 16 }} />
      
      <Button mode="contained" onPress={handleLogin} style={{ marginBottom: 8 }}>
        {t("login_email")}
      </Button>
      <Button mode="outlined" onPress={signInWithGoogle} style={{ marginBottom: 8 }}>
        {t("login_google")}
      </Button>
      <Button mode="text" onPress={() => router.push("/CadastrarScreen")}>{t("no_account")}</Button>
    </View>
  );
}
