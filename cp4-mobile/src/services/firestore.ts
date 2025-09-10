import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export interface Task {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
}

export function tasksCollection() {
  const uid = auth().currentUser?.uid;
  return firestore().collection('users').doc(uid).collection('tasks');
}