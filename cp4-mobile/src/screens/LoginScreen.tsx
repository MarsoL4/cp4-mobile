import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function LoginScreen({ navigation }: any) {
  const { t } = useTranslation();

  const handleLogin = () => {
    // Lógica de autenticação (Google/Email) será implementada aqui
    navigation.replace('TaskList');
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge">{t('welcome')}</Text>
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        {t('login')}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: { marginTop: 16 }
});