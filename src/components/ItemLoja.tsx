import { StyleSheet, View, Text, Pressable, Alert } from "react-native";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { doc, updateDoc, deleteDoc, db } from '../services/firebaseConfig';
import { useTheme } from "../context/ThemeContext";

type Props = {
  id: string;
  nomeProduto: string;
  isChecked: boolean;
};

export default function ItemLoja({ id, nomeProduto, isChecked: initialChecked }: Props) {
  const [isChecked, setIsChecked] = useState(initialChecked);
  const { colors } = useTheme();

  const updateIsChecked = async () => {
    const itemRef = doc(db, 'items', id);
    await updateDoc(itemRef, { isChecked });
  };

  const deletarItem = async () => {
    Alert.alert("Confirmar Exclusão?", "Tem certeza que deseja excluir o produto?", [
      { text: 'Cancelar' },
      { text: 'Excluir', onPress: async () => await deleteDoc(doc(db, 'items', id)) }
    ], { cancelable: true });
  };

  useEffect(() => {
    updateIsChecked();
  }, [isChecked]);

  return (
    <View style={[styles.container, { backgroundColor: colors.button }]}>
      <Pressable onPress={() => setIsChecked(!isChecked)}>
        {isChecked ? (
          <AntDesign name="checkcircle" color={colors.text} size={24} />
        ) : (
          <AntDesign name="checkcircleo" color={colors.text} size={24} />
        )}
      </Pressable>
      <Text style={[styles.title, { color: colors.text }]}>{nomeProduto}</Text>
      <Pressable onPress={deletarItem}>
        <MaterialIcons name='delete' color={colors.buttonText} size={24} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 10,
  },
  title: {
    flex: 1,
    marginLeft: 10,
    fontSize: 17,
    fontWeight: '500'
  }
});
