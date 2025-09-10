import { Text, Button, Alert, TextInput, StyleSheet, ActivityIndicator, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { addDoc, collection, db, getDocs } from "../src/services/firebaseConfig";
import { auth } from '../src/services/firebaseConfig'
import { deleteUser } from "firebase/auth";
import ItemLoja from "../src/components/ItemLoja";
import { useEffect, useState } from "react";
import ThemeToggleButton from "../src/components/ThemeToggleButton";
import { useTheme } from "../src/context/ThemeContext";
import * as Notifications from "expo-notifications"
import * as Device from "expo-device"

//Configuração Global das notificações no foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true, //exibe o banner de notificação
        shouldShowList: true,//exibe no histórico
        shouldPlaySound: true, //habilita o som
        shouldSetBadge: false //não altera o badge do app
    })
})

export default function HomeScreen() {
    const { colors } = useTheme()//Pega o esquema de cores
    const router = useRouter()//Hook de navegação
    const [nomeProduto, setNomeProduto] = useState('')
    interface Item {
        id: string;
        nomeProduto: string;
        isChecked: boolean
    }
    const [listaItems, setListaItems] = useState<Item[]>([])

    const realizarLogoff = async () => {
        await AsyncStorage.removeItem('@user')
        router.push('/')//Redireciona para index.tsx
    }

    const excluirConta = () => {
        Alert.alert("CONFIRMAR EXCLUSÃO", "Tem certeza que deseja excluir? Esta ação não poderá ser desfeita.",
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir', style: 'destructive',
                    onPress: async () => {
                        try {
                            const user = auth.currentUser
                            if (user) {
                                await deleteUser(user)//Deleta o user do firebase Auth
                                await AsyncStorage.removeItem('@user')
                                Alert.alert("Conta Excluída", "Sua conta foi excluída com sucesso.")
                                router.replace('/')
                            } else {
                                Alert.alert("Erro", "Nenhum usuário logado")
                            }
                        } catch (error) {
                            console.log("Erro ao excluir conta")
                            Alert.alert("Erro", "Não foi possível excluir a conta")
                        }
                    }
                }
            ], {
            cancelable: true
        }
        )
    }

    const salvarItem = async () => {
        try {
            const docRef = await addDoc(collection(db, 'items'), {
                nomeProduto: nomeProduto,
                isCheked: false
            })
            //console.log("Sucesso ao salvar", docRef.id)
            Alert.alert("Sucesso", "Produto salvo com sucesso.")
            setNomeProduto('')//Limpa o TextInput
        } catch (e) {
            console.log("Error ao salvar", e)
        }
    }

    const buscarItems = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'items'))
            const items: any[] = []

            querySnapshot.forEach((item) => {
                items.push({
                    ...item.data(),
                    id: item.id
                })
            })
            //console.log("Dados carregados",items)
            setListaItems(items)
        } catch (e) {
            console.log("Erro ao buscar os dados", e)
        }
    }

    //Notificação local
    const dispararNotificacao = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Promoções do Dia", //Titulo da notificação
                body: "Aproveite as promoções do dia 08/09/2025"
            },
            trigger: {
                type: "timeInterval", //Tipo do trigger: intervalo de tempo
                seconds: 2, //aguarda 2 segundos antes de disparar
                repeats: false //não repete
            } as Notifications.TimeIntervalTriggerInput
        })
    }

    useEffect(() => {
        buscarItems()
    }, [listaItems])

    useEffect(() => {
        (async () => {
            if (Device.isDevice) {
                //Verifica se já tem permissão da notificação
                const { status: existingStatus } = await Notifications.getPermissionsAsync()
                let finalStatus = existingStatus

                //Se não houver premissão concedida, vms solicitar o usuário
                if (existingStatus !== "granted") {
                    const { status } = await Notifications.requestPermissionsAsync()
                    finalStatus = status
                }

                //Mesmo com o request ainda não foi permito o acesso a notificação
                if (finalStatus !== "granted") {
                    alert("Permissão de notificação não foram concedidas.")
                    return
                }
            }else{
                alert("Vc precisa de um disposito físico para receber as notificações.")
                return
            }
        })()
    },[])


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView //É um componente que ajuste o layout automaticamente
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={20}//desloca o conteúdo verticalmente
            >
                <ThemeToggleButton />
                <Text style={[styles.texto, { color: colors.text }]}>Seja bem-vindo - Você está Logado!!</Text>
                <Button title="Sair da conta" onPress={realizarLogoff} />
                <Button title="Excluir conta" color='red' onPress={excluirConta} />
                <Button title="Alterar Senha" onPress={() => router.push('AlterarSenhaScreen')} />
                <Button title="Enviar notificação" color="purple" onPress={dispararNotificacao} />

                {listaItems.length <= 0 ? <ActivityIndicator /> : (
                    <FlatList
                        data={listaItems}
                        renderItem={({ item }) => (
                            <ItemLoja
                                nomeProduto={item.nomeProduto}
                                isChecked={item.isChecked}
                                id={item.id}
                            />
                        )}
                    />
                )}

                <TextInput
                    placeholder="Digite o nome do produto"
                    style={styles.input}
                    value={nomeProduto}
                    onChangeText={(value) => setNomeProduto(value)}
                    onSubmitEditing={salvarItem}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    input: {
        backgroundColor: 'lightgray',
        width: '90%',
        padding: 10,
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 20
    },
    texto: { fontSize: 16 }
})