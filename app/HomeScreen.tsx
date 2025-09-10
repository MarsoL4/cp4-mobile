import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { TextInput, Button, Text, Card, FAB, Modal, Portal, Checkbox } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../src/context/ThemeContext'; // use só seu contexto!
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { app } from '../src/services/firebaseConfig';
import { scheduleTaskNotification } from '../src/services/notifications';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../src/context/AuthContext';

export default function HomeScreen() {
  const { user, signOut } = useContext(AuthContext);
  const { toggleTheme, theme, colors } = useTheme(); // use só o hook!
  const { t, i18n } = useTranslation();
  const db = getFirestore(app);
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    completed: false,
    dueDate: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { data: motivation } = useQuery({
    queryKey: ['motivation'],
    queryFn: () => fetch('https://api.quotable.io/random').then(res => res.json()),
  });

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'tasks'), orderBy('dueDate'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(list);
    });
    return unsubscribe;
  }, [user]);

  const handleSaveTask = async () => {
    if (!form.title || !form.description) return;
    const taskData = {
      ...form,
      dueDate: form.dueDate.toISOString(),
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    if (editingTask) {
      await updateDoc(doc(tasksRef, editingTask.id), taskData);
    } else {
      await addDoc(tasksRef, taskData);
      await scheduleTaskNotification(form.title, form.dueDate);
    }
    setModalVisible(false);
    setEditingTask(null);
    setForm({ title: '', description: '', completed: false, dueDate: new Date() });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description,
      completed: task.completed,
      dueDate: new Date(task.dueDate),
    });
    setModalVisible(true);
  };

  const handleDeleteTask = async (taskId) => {
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    await deleteDoc(doc(tasksRef, taskId));
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Faça login para acessar suas tarefas.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
        <Button mode="outlined" style={{ marginRight: 8 }} onPress={() => i18n.changeLanguage('pt')}>PT</Button>
        <Button mode="outlined" onPress={() => i18n.changeLanguage('en')}>EN</Button>
        <Button mode="contained" style={{ marginLeft: 8 }} onPress={toggleTheme}>{theme === 'dark' ? '🌙' : '☀️'}</Button>
      </View>
      <Text style={{ fontSize: 24, margin: 24, textAlign: 'center' }}>{t('my_tasks')}</Text>
      {motivation && (
        <Card style={{ margin: 16 }}>
          <Card.Content>
            <Text style={{ fontSize: 18 }}>{t('motivation')}</Text>
            <Text>{motivation.content}</Text>
            <Text style={{ fontStyle: 'italic', marginTop: 8 }}>— {motivation.author}</Text>
          </Card.Content>
        </Card>
      )}
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={{ margin: 8 }} onPress={() => handleEditTask(item)}>
            <Card.Title title={item.title} subtitle={item.dueDate ? new Date(item.dueDate).toLocaleString() : ''} />
            <Card.Content>
              <Text>{item.description}</Text>
              <Text>{t(item.completed ? 'completed' : 'pending')}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => handleEditTask(item)}>{t('edit')}</Button>
              <Button onPress={() => handleDeleteTask(item.id)}>{t('delete')}</Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 32 }}>{t('no_tasks')}</Text>}
      />
      <FAB
        icon="plus"
        style={{ position: 'absolute', right: 16, bottom: 32, backgroundColor: colors.primary }}
        onPress={() => setModalVisible(true)}
      />
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={{ margin: 24, backgroundColor: colors.surface, padding: 16, borderRadius: 12 }}>
          <View>
            <Text style={{ fontSize: 18, marginBottom: 12 }}>{editingTask ? t('edit') : t('register')}</Text>
            <TextInput
              label={t('name')}
              value={form.title}
              onChangeText={(text) => setForm((f) => ({ ...f, title: text }))}
              style={{ marginBottom: 8 }}
              mode="outlined"
            />
            <TextInput
              label={t('description')}
              value={form.description}
              onChangeText={(text) => setForm((f) => ({ ...f, description: text }))}
              style={{ marginBottom: 8 }}
              mode="outlined"
            />
            <Button onPress={() => setShowDatePicker(true)} style={{ marginBottom: 8 }}>
              {form.dueDate ? `${t('due_date')}: ${form.dueDate.toLocaleString()}` : t('due_date')}
            </Button>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Checkbox
                status={form.completed ? 'checked' : 'unchecked'}
                onPress={() => setForm((f) => ({ ...f, completed: !f.completed }))}
              />
              <Text>{t('completed')}</Text>
            </View>
            <Button mode="contained" onPress={handleSaveTask} style={{ marginBottom: 8 }}>{t('save')}</Button>
            <Button mode="text" onPress={() => setModalVisible(false)}>{t('cancel')}</Button>
          </View>
        </Modal>
      </Portal>
      <Button mode="outlined" onPress={signOut} style={{ margin: 16 }}>
        Sair
      </Button>
    </View>
  );
}