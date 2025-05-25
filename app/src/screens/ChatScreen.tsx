import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, IconButton, Text } from 'react-native-paper';
import axios from 'axios';
import io from 'socket.io-client';
import { API_URL } from '../../context/AuthContext';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

// Parametros de ruta para el chat
type RootStackParamList = {
  Chat: { chatId: string; chatName?: string };
};

type ChatRouteProp = RouteProp<RootStackParamList, 'Chat'>;

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
}

export default function ChatScreen() {
  const route = useRoute<ChatRouteProp>();
  const { chatId } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const socketRef = useRef<any>(null);

  // Carga mensajes previos
  useEffect(() => {
    axios.get(`${API_URL}/api/chats/${chatId}/messages`)
      .then(res => setMessages(res.data))
      .catch(() => {});
  }, [chatId]);

  // Conexión Socket.IO
  useEffect(() => {
    const socket = io(API_URL);
    socket.emit('join-chat', { chatId });
    socket.on('receive-message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });
    socketRef.current = socket;
    return () => {
      socket.disconnect();
    };
  }, [chatId]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const content = inputText;
    // Emite mensaje por WebSocket
    socketRef.current.emit('send-message', { chatId, content });
    setInputText('');
  };
  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            <Text>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <IconButton icon="send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5dc' },
  messagesList: { flex: 1 },
  messagesContainer: { padding: 16, flexGrow: 1 },
  messageBubble: { padding: 12, backgroundColor: '#fff', borderRadius: 8, marginVertical: 4, maxWidth: '80%' },
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
