import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Card, FAB, Modal, Portal, Checkbox } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../src/context/ThemeContext';
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { app } from '../src/services/firebaseConfig';
import { scheduleTaskNotification } from '../src/services/notifications';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../src/context/AuthContext';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { user, signOut } = useContext(AuthContext);
  const { toggleTheme, theme, colors } = useTheme();
  const { t, i18n } = useTranslation();
  const db = getFirestore(app);
  const router = useRouter();

  const [tasks, setTasks] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [form, setForm] = useState({ title: '', description: '', completed: false, dueDate: new Date() });

  const { data: motivation } = useQuery({
    queryKey: ['motivation'],
    queryFn: () => fetch('https://api.quotable.io/random').then(res => res.json()),
  });

  // Carregar tarefas
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'tasks'), orderBy('dueDate'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(list);
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) router.replace('/');
  }, [user]);

  const handleSaveTask = async () => {
    if (!form.title || !form.description) return;
    const taskData = {
      ...form,
      dueDate: form.dueDate.toISOString(),
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    if (editingTask) await updateDoc(doc(tasksRef, editingTask.id), taskData);
    else {
      await addDoc(tasksRef, taskData);
      await scheduleTaskNotification(form.title, form.dueDate);
    }
    setModalVisible(false);
    setEditingTask(null);
    setForm({ title: '', description: '', completed: false, dueDate: new Date() });
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description,
      completed: task.completed,
      dueDate: new Date(task.dueDate)
    });
    setModalVisible(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    await deleteDoc(doc(tasksRef, taskId));
  };

  const toggleCompleted = async (task: any) => {
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    await updateDoc(doc(tasksRef, task.id), { completed: !task.completed });
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  if (!user) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingTop: 45 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button mode="outlined" onPress={() => i18n.changeLanguage('pt')}>PT</Button>
          <Button mode="outlined" onPress={() => i18n.changeLanguage('en')}>EN</Button>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Button mode="contained" onPress={toggleTheme}>{theme === 'dark' ? '🌙' : '☀️'}</Button>
          <Button mode="outlined" onPress={handleSignOut}>{t('sair') || 'Sair'}</Button>
        </View>
      </View>

      <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 16, color: colors.text }}>{t('my_tasks')}</Text>

      {motivation && (
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Text style={{ fontSize: 18, color: colors.text, marginBottom: 4 }}>{t('motivation')}</Text>
            <Text style={{ color: colors.text }}>{motivation.content}</Text>
            <Text style={{ fontStyle: 'italic', marginTop: 8, color: colors.text }}>— {motivation.author}</Text>
          </Card.Content>
        </Card>
      )}

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 12 }}>
            <Card.Title title={item.title} subtitle={item.dueDate ? new Date(item.dueDate).toLocaleString() : ''} />
            <Card.Content>
              <Text style={{ color: '#000', marginBottom: 8 }}>{item.description}</Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 4,
                  borderWidth: 1,
                  borderColor: '#000',
                  borderRadius: 6,
                  alignSelf: 'flex-start',
                }}
                onPress={() => toggleCompleted(item)}
              >
                <Checkbox
                  status={item.completed ? 'checked' : 'unchecked'}
                />
                <Text style={{ color: '#000', marginLeft: 6, fontSize: 14 }}>
                  {t(item.completed ? 'completed' : 'pending')}
                </Text>
              </TouchableOpacity>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => handleEditTask(item)}>{t('edit')}</Button>
              <Button onPress={() => handleDeleteTask(item.id)}>{t('delete')}</Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 32, color: colors.text }}>{t('sem tarefas')}</Text>}
      />

      <FAB
        icon="plus"
        style={{ position: 'absolute', right: 16, bottom: 32, backgroundColor: colors.primary }}
        onPress={() => setModalVisible(true)}
      />

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={{ backgroundColor: colors.surface, padding: 16, borderRadius: 12 }}>
          <Text style={{ fontSize: 18, marginBottom: 12, color: colors.text }}>{editingTask ? t('edit') : t('register')}</Text>
          <TextInput
            label={t('name')}
            value={form.title}
            onChangeText={text => setForm(f => ({ ...f, title: text }))}
            style={{ marginBottom: 8 }}
            mode="outlined"
          />
          <TextInput
            label={t('description')}
            value={form.description}
            onChangeText={text => setForm(f => ({ ...f, description: text }))}
            style={{ marginBottom: 8 }}
            mode="outlined"
          />
          <Button onPress={() => setForm(f => ({ ...f, dueDate: new Date() }))} style={{ marginBottom: 8 }}>
            {form.dueDate ? `${t('due_date')}: ${form.dueDate.toLocaleString()}` : t('due_date')}
          </Button>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', padding: 4, borderWidth: 1, borderColor: '#000', borderRadius: 6, marginBottom: 16, alignSelf: 'flex-start' }}
            onPress={() => setForm(f => ({ ...f, completed: !f.completed }))}
          >
            <Checkbox
              status={form.completed ? 'checked' : 'unchecked'}
              color={'#000'}
              uncheckedColor={'#000'}
            />
            <Text style={{ color: '#000', marginLeft: 6, fontSize: 14 }}>{t('completed')}</Text>
          </TouchableOpacity>
          <Button mode="contained" onPress={handleSaveTask} style={{ marginBottom: 8 }}>{t('save')}</Button>
          <Button mode="text" onPress={() => setModalVisible(false)}>{t('cancel')}</Button>
        </Modal>
      </Portal>
    </View>
  );
}