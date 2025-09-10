import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function TaskListScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text variant="titleLarge">{t('tasks')}</Text>
      {/* Lista de tarefas será implementada aqui */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});