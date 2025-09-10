import { useEffect, useState } from 'react';
import { tasksCollection, Task } from '../services/firestore';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = tasksCollection()
      .orderBy('dueDate')
      .onSnapshot(snapshot => {
        const list: Task[] = [];
        snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() } as Task));
        setTasks(list);
        setLoading(false);
      });
    return unsubscribe;
  }, []);

  return { tasks, loading };
}