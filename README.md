# Projeto CP4 - Lista Tarefas Plus
# 2TDSPM
**Participantes:**  
- Enzo Marsola RM556310
- Cauan da Cruz RM558238
- Igor Barrocal RM555217

---

Aplicativo mobile para gerenciamento de tarefas, com autenticação via Google e e-mail, sincronização em tempo real com Firestore, tema claro/escuro, internacionalização, notificações locais e integração com API motivacional usando TanStack Query.

## Funcionalidades

- **Autenticação com Google e E-mail (Firebase)**
  - Login e cadastro via e-mail/senha ou Google.
  - Persistência do login (auto-login).

- **Sincronização de tarefas**
  - Cada usuário possui sua própria coleção de tarefas no Firestore.
  - Lista de tarefas com sincronização em tempo real (onSnapshot).
  - CRUD completo: adicionar, editar, marcar como concluída, remover tarefas.

- **Tema Claro/Escuro**
  - Alternância entre temas com persistência (AsyncStorage).

- **Internacionalização**
  - Suporte a português e inglês.
  - Troca dinâmica de idioma em todas as telas.

- **Notificações Locais**
  - Agendamento de notificações para cada tarefa (Expo Notifications).
  - Permissão solicitada e lembrete enviado na data/hora definida.

- **TanStack Query**
  - Integração com API externa para exibir frase motivacional na tela principal.

- **Design e UX**
  - Interface responsiva e intuitiva.
  - Navegação fluida com React Navigation.
  - Componentes do React Native Paper.

## Arquitetura

- **React Native + Expo**
- **Firebase (Firestore e Auth)**
- **React Navigation**
- **React Native Paper (UI)**
- **React-i18next (i18n)**
- **TanStack Query (API motivacional)**
- **Expo Notifications**
- **AsyncStorage (persistência do tema e login)**
- **Separação por contexto:**  
  - `AuthContext`: autenticação e persistência do usuário  
  - `ThemeContext`: gerência e persistência do tema

## Estrutura Firestore

```
users/{uid}/tasks/{taskId}
```
Cada usuário possui sua própria coleção de tarefas.

## Como rodar

1. **Pré-requisitos:**
   - Node.js, npm/yarn, Expo CLI (`npm install -g expo-cli`)
   - Crie um app Firebase, configure Firestore e Auth (Google e E-mail)
   - Configure os IDs do Google no `AuthContext.tsx`

2. **Instale dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Rodar em modo desenvolvimento:**
   ```bash
   expo start
   ```

4. **Gerar APK (Expo EAS Build):**
   ```bash
   eas build -p android
   ```

## Como usar

- Faça login/cadastro com e-mail ou Google.
- Adicione, edite, conclua ou exclua tarefas.
- Troque o idioma (PT/EN) e o tema (claro/escuro).
- Receba notificações de lembrete de tarefa.
- Veja frases motivacionais na tela principal.

## Vídeo Demonstrativo

- [Link para vídeo (até 5 min)](URL_DO_VIDEO)

## Bibliotecas utilizadas

- `@react-native-firebase/app`
- `@react-native-firebase/auth`
- `@react-native-firebase/firestore`
- `@react-navigation/native`
- `react-native-paper`
- `react-i18next`
- `expo-notifications`
- `@tanstack/react-query`
- `@react-native-async-storage/async-storage`
- `expo-router`

## Observações

- Altere os IDs do Google OAuth para os seus no Firebase.
- O app está pronto para ser customizado e expandido conforme sua necessidade!

---

**Desenvolvido para o desafio CP4-Mobile.**
