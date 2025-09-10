import React, { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { auth } from "../src/services/firebaseConfig";
import { useRouter } from "expo-router";

export default function AlterarSenhaScreen() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const router = useRouter();

  const handleAlterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert("Atenção", "Preencha todos os campos!");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert("Erro", "A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user || !user.email) {
        Alert.alert("Erro", "Nenhum usuário logado.");
        return;
      }

      const credencial = EmailAuthProvider.credential(user.email, senhaAtual);
      await reauthenticateWithCredential(user, credencial);
      await updatePassword(user, novaSenha);

      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      router.replace("/HomeScreen");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", error.message || "Senha não alterada");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Alterar Senha</Text>

      <TextInput
        label="Senha Atual"
        value={senhaAtual}
        onChangeText={setSenhaAtual}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        label="Nova Senha"
        value={novaSenha}
        onChangeText={setNovaSenha}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        label="Confirmar Nova Senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
        style={styles.input}
      />

      <Button mode="contained" onPress={handleAlterarSenha} style={styles.botao}>
        Alterar Senha
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  botao: {
    backgroundColor: "#00B37E",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});
