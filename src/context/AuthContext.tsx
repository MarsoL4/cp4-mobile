import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut, GoogleAuthProvider, signInWithCredential, User } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { app } from '../services/firebaseConfig';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const auth = getAuth(app);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'SUA_CLIENT_ID.apps.googleusercontent.com', 
    iosClientId: 'SUA_IOS_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'SUA_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      setUser(usr);
      setLoading(false);
      if (usr) await AsyncStorage.setItem('user', JSON.stringify(usr));
      else await AsyncStorage.removeItem('user');
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch(err => console.log("Erro login Google:", err));
    }
  }, [response]);

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      console.log('Erro ao logar:', e.message || e);
    }
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    await promptAsync();
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.log("Erro ao deslogar:", e);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}