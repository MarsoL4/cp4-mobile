//Contexto será responsável pelo gerenciamento do tema (dark e light)
import React,{createContext,useContext,useEffect,useState} from "react";
import { Appearance } from "react-native";

//Criação do contexto
const ThemeContext = createContext()

//Hook customizado para acessar o tema
export function useTheme(){
    return useContext(ThemeContext)
}

//Provider que envolve todo a aplicação
export function ThemeProvider({children}){
    //Detecta o tema inicial do dispositivo
    const colorScheme = Appearance.getColorScheme()

    //Estado para armazenar o tema (light ou dark)
    const[theme,setTheme] = useState(colorScheme || 'light')

    //Função para alternar entre os temas
    const toggleTheme = ()=>{
        setTheme((value)=>value==='light'?'dark':'light')
    }

    //Definicação cores de temas
    const themeColors = {
        light:{
            background:'#fff',
            text:'#000',
            button:'#007bff',
            buttonText:'#fff'
        },
        dark:{
            background:'#000',
            text:'#fff',
            button:'#0bf359ff',
            buttonText:'#000'
        }
    }
  
    return(
        <ThemeContext.Provider value={{toggleTheme,colors:themeColors[theme]}}>
            {children}
        </ThemeContext.Provider>
    )
}

