import React, { useState } from "react";
import { View, Alert } from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "../src/services/firebaseConfig";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

export default function CadastrarScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();

  const handleCadastro = async () => {
    if (!nome || !email || !senha) {
      Alert.alert(t("attention"), t("fill_all_fields"));
      return;
    }

    if (senha.length < 6) {
      Alert.alert(t("attention"), t("password_min_length"));
      return;
    }

    try {
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: nome });
      }

      Alert.alert(t("success"), t("register_success"));
      router.replace("/"); // tela de login é index.tsx
    } catch (error: any) {
      Alert.alert(t("error"), error.message || String(error));
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: colors.background }}>
      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 16 }}>
        <Button mode="outlined" style={{ marginRight: 8 }} onPress={() => i18n.changeLanguage("pt")}>PT</Button>
        <Button mode="outlined" onPress={() => i18n.changeLanguage("en")}>EN</Button>
      </View>

      <Text style={{ fontSize: 28, textAlign: "center", marginBottom: 24, color: colors.text }}>
        {t("register")}
      </Text>

      <TextInput
        label={t("name")}
        value={nome}
        onChangeText={setNome}
        style={{ marginBottom: 16 }}
        mode="outlined"
      />
      <TextInput
        label={t("email")}
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 16 }}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label={t("password")}
        value={senha}
        onChangeText={setSenha}
        style={{ marginBottom: 16 }}
        mode="outlined"
        secureTextEntry
      />

      <Button mode="contained" onPress={handleCadastro} style={{ marginBottom: 8 }}>
        {t("register")}
      </Button>
      <Button mode="text" onPress={() => router.replace("/")}>
        {t("back_to_login")}
      </Button>
    </View>
  );
}