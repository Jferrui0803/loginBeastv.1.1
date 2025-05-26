import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, IconButton, Text } from 'react-native-paper';
import axios from 'axios';
import io from 'socket.io-client';
import { API_URL } from '../../context/AuthContext';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

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
  const { authState } = useAuth();
  const userId = authState?.userId;

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

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const content = inputText;
    setInputText('');
    try {
      // Guardar mensaje en el backend
      const res = await axios.post(`${API_URL}/api/chats/${chatId}/messages`, { content });
      const newMsg = res.data;
      setMessages(prev => [...prev, newMsg]);
      // Emitir por WebSocket (opcional, si el backend no lo hace automáticamente)
      if (socketRef.current) {
        socketRef.current.emit('send-message', { chatId, content });
      }
    } catch (e) {
      // Manejo de error opcional
    }
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
          <View style={[
            styles.messageBubble,
            item.senderId === userId ? styles.messageSent : styles.messageReceived
          ]}>
            <Text style={item.senderId === userId ? styles.textSent : styles.textReceived}>{item.content}</Text>
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
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    marginVertical: 6,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  messageSent: {
    alignSelf: 'flex-end',
    backgroundColor: '#ffa500',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    marginLeft: 40,
  },
  messageReceived: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    marginRight: 40,
    borderWidth: 1,
    borderColor: '#eee',
  },
  textSent: { color: '#fff', fontWeight: 'bold' },
  textReceived: { color: '#333' },
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
