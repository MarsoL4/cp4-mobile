import React, { useEffect, useState } from "react";
import { SafeAreaView, TextInput, FlatList, Alert, StyleSheet, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { auth, db } from "../src/services/firebaseConfig";
import { collection, addDoc, query, onSnapshot, doc } from "firebase/firestore";
import TaskItem from "../src/components/TaskItem";
import ThemeToggleButton from "../src/components/ThemeToggleButton";
import { useTheme } from "../src/context/ThemeContext";
import { scheduleTaskNotification, askNotificationPermission } from "../src/services/notifications";
import { useMotivation } from "../src/hooks/useMotivation";

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const userId = auth.currentUser?.uid;

  // Motivational phrase
  const motivation = useMotivation();

  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, "users", userId, "tasks"));
    const unsubscribe = onSnapshot(q, snapshot => {
      const arr: any[] = [];
      snapshot.forEach(doc => arr.push({ id: doc.id, ...doc.data() }));
      setTasks(arr);
    });
    return unsubscribe;
  }, [userId]);

  const addTask = async () => {
    if (!task) return;
    await addDoc(collection(db, "users", userId!, "tasks"), {
      name: task,
      isChecked: false
    });
    setTask("");
    // Agenda notificação para daqui a 1 minuto
    await scheduleTaskNotification("Tarefa criada", `Não esqueça: ${task}`, new Date(Date.now() + 60000));
  };

  useEffect(() => { askNotificationPermission(); }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("@user");
    router.push("/");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ThemeToggleButton />
      <Text style={[styles.text, { color: colors.text }]}>Motivação de hoje: {motivation.data ?? "..."}</Text>
      <Button title="Sair" onPress={logout} />
      <TextInput
        placeholder="Nova tarefa"
        style={[styles.input, { color: colors.text }]}
        value={task}
        onChangeText={setTask}
        onSubmitEditing={addTask}
      />
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TaskItem id={item.id} name={item.name} isChecked={item.isChecked} />
        )}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: {
    backgroundColor: "#ededed",
    borderRadius: 10,
    marginTop: 10,
    padding: 10
  },
  text: { fontSize: 16, marginBottom: 10 }
});