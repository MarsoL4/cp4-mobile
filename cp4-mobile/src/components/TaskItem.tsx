import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Checkbox, IconButton, Text } from 'react-native-paper';

interface TaskItemProps {
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskItem({
  title,
  description,
  completed,
  dueDate,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemProps) {
  return (
    <Card style={styles.card}>
      <Card.Title
        title={title}
        subtitle={new Date(dueDate).toLocaleString()}
        left={() => (
          <Checkbox status={completed ? 'checked' : 'unchecked'} onPress={onToggle} />
        )}
        right={() => (
          <>
            <IconButton icon="pencil" onPress={onEdit} />
            <IconButton icon="delete" onPress={onDelete} />
          </>
        )}
      />
      {description ? <Card.Content><Text>{description}</Text></Card.Content> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginVertical: 6, marginHorizontal: 12 }
});