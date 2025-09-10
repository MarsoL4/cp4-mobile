import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable, Alert } from "react-native";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { doc, updateDoc, deleteDoc, db } from "../services/firebaseConfig";
import { useTheme } from "../context/ThemeContext";

type Props = {
  id: string;
  name: string;
  isChecked: boolean;
  onDelete?: () => void;
};

export default function TaskItem({ id, name, isChecked: checkedInit, onDelete }: Props) {
  const [isChecked, setIsChecked] = useState(checkedInit);
  const { colors } = useTheme();

  useEffect(() => {
    const updateIsChecked = async () => {
      try {
        await updateDoc(doc(db, "tasks", id), { isChecked });
      } catch (e) {
        console.log("Erro ao atualizar tarefa:", e);
      }
    };
    updateIsChecked();
  }, [isChecked, id]);

  const deleteItem = async () => {
    Alert.alert("Excluir Tarefa?", "Confirma exclusão?", [
      { text: "Cancelar" },
      { text: "Excluir", onPress: async () => { await deleteDoc(doc(db, "tasks", id)); onDelete?.(); } }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.button }]}>
      <Pressable onPress={() => setIsChecked(!isChecked)}>
        {isChecked ? (
          <AntDesign name="checkcircle" color={colors.text} size={24} />
        ) : (
          <AntDesign name="checkcircleo" color={colors.text} size={24} />
        )}
      </Pressable>
      <Text style={[styles.title, { color: colors.text }]}>{name}</Text>
      <Pressable onPress={deleteItem}>
        <MaterialIcons name="delete" color={colors.buttonText} size={24} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginTop: 10
  },
  title: {
    flex: 1,
    marginLeft: 10,
    fontSize: 17,
    fontWeight: "500"
  }
});
