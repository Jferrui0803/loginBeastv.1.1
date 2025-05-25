import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { TextInput, IconButton, Text, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../context/AuthContext';
import { RouteProp, useRoute } from '@react-navigation/native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  isTyping?: boolean;
}

interface IAChat {
  id: string;
  title: string;
  messages: Message[];
}

type IAChatType = 'nutrition' | 'training';

type RootStackParamList = {
  IAChatDetail: { chatId: string; chatTitle: string; chatType: IAChatType };
};

type ChatRouteProp = RouteProp<RootStackParamList, 'IAChatDetail'>;

const getStorageKey = (chatType: IAChatType) =>
  chatType === 'nutrition' ? 'iaChats_nutrition' : 'iaChats_training';

// Componente para mostrar el indicador de "escribiendo..."
const TypingIndicator = () => {
  const [dots, setDots] = useState('.');
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.');
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4 }}>
      <ActivityIndicator size="small" color="#666" />
      <Text style={{ marginLeft: 8, fontStyle: 'italic', color: '#666', minWidth: 80 }}>
        Escribiendo{dots}
      </Text>
    </View>
  );
};

const IAChatDetailScreen = () => {
  const route = useRoute<ChatRouteProp>();
  const { chatId, chatTitle, chatType } = route.params;
  const [chat, setChat] = useState<IAChat | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadChat = async () => {
      const storedChats = await AsyncStorage.getItem(getStorageKey(chatType));
      if (storedChats) {
        const chats: IAChat[] = JSON.parse(storedChats);
        const currentChat = chats.find(c => c.id === chatId) || null;
        setChat(currentChat);
      }
    };
    loadChat();
  }, [chatId, chatType]);
  const sendMessage = async () => {
    if (!inputText.trim() || !chat || isLoading) return;
    
    setIsLoading(true);
    const userMsg: Message = { id: Date.now().toString(), text: inputText, sender: 'user' };
    
    // Crear mensaje de "escribiendo..."
    const typingMsg: Message = { 
      id: 'typing', 
      text: 'Escribiendo...', 
      sender: 'bot', 
      isTyping: true 
    };
    
    const updatedChatWithUser = { ...chat, messages: [...chat.messages, userMsg] };
    const updatedChatWithTyping = { ...updatedChatWithUser, messages: [...updatedChatWithUser.messages, typingMsg] };
    
    setChat(updatedChatWithTyping);
    
    const storedChats = await AsyncStorage.getItem(getStorageKey(chatType));
    let chats: IAChat[] = storedChats ? JSON.parse(storedChats) : [];
    chats = chats.map(c => (c.id === chatId ? updatedChatWithUser : c));
    await AsyncStorage.setItem(getStorageKey(chatType), JSON.stringify(chats));
    setInputText('');
    
    try {
      const response = await axios.post(`${API_URL}/api/ia/consultar`, { pregunta: userMsg.text });
      const botText = response.data.respuesta || response.data.answer || '';
      const botMsg: Message = { id: (Date.now() + 1).toString(), text: botText, sender: 'bot' };
      
      // Remover mensaje de typing y agregar respuesta real
      const finalChat = { ...updatedChatWithUser, messages: [...updatedChatWithUser.messages, botMsg] };
      setChat(finalChat);
      chats = chats.map(c => (c.id === chatId ? finalChat : c));
      await AsyncStorage.setItem(getStorageKey(chatType), JSON.stringify(chats));
    } catch (error) {
      const errMsg: Message = { id: (Date.now() + 2).toString(), text: 'Error al comunicar con el servidor.', sender: 'bot' };
      const finalChat = { ...updatedChatWithUser, messages: [...updatedChatWithUser.messages, errMsg] };
      setChat(finalChat);
      chats = chats.map(c => (c.id === chatId ? finalChat : c));
      await AsyncStorage.setItem(getStorageKey(chatType), JSON.stringify(chats));
    } finally {
      setIsLoading(false);
    }
  };  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={chat?.messages || []}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'user' ? styles.user : styles.bot]}>
            {item.isTyping ? <TypingIndicator /> : <Text>{item.text}</Text>}
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu mensaje..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <IconButton icon="send" onPress={sendMessage} disabled={isLoading} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default IAChatDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5dc' },
  messagesList: { flex: 1 },
  messagesContainer: { padding: 16, flexGrow: 1 },
  message: { padding: 12, borderRadius: 8, marginVertical: 4, maxWidth: '80%' },
  user: { alignSelf: 'flex-end', backgroundColor: '#ffa500' },
  bot: { alignSelf: 'flex-start', backgroundColor: '#fff' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    padding: 8, 
    borderTopWidth: 1, 
    borderColor: '#ccc', 
    backgroundColor: '#f5f5dc',
    minHeight: 60
  },
  input: { 
    flex: 1, 
    backgroundColor: '#fff', 
    marginRight: 8,
    maxHeight: 100
  },
});