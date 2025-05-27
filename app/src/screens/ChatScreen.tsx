import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
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
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const socketRef = useRef<any>(null);
  const flatListRef = useRef<FlatList>(null);  const { authState } = useAuth();
  const userId = authState?.userId;

  // Carga mensajes previos
  useEffect(() => {
    axios.get(`${API_URL}/api/chats/${chatId}/messages`)
      .then(res => {
        setMessages(res.data);
        // Hacer scroll al final después de cargar los mensajes
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 100);
      })
      .catch(() => {});
  }, [chatId]);

  // Listeners del teclado
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      // Scroll al final cuando aparece el teclado
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Conexión Socket.IO
  useEffect(() => {
    const socket = io(API_URL, {
      auth: { token: authState?.token }, // Enviar token si es necesario
    });
    socket.emit('join-chat', chatId); // Unirse a la sala del chat
    if (userId) {
      socket.emit('join-user', userId); // Unirse a la sala personal del usuario
    }
    socket.on('receive-message', (msg: Message) => {
      setMessages(prev => [...prev, msg]);
      console.log('Nuevo mensaje recibido:', msg);
    });
    socketRef.current = socket;
    return () => {
      socket.disconnect();
    };  }, [chatId, userId, authState?.token]);

  // Scroll automático solo para mensajes nuevos (no para la carga inicial)
  useEffect(() => {
    if (messages.length > 0) {
      // Solo hacer scroll automático si hay más de un mensaje 
      // (evitar el scroll en la carga inicial que ya se maneja arriba)
      const isInitialLoad = messages.length === 1;
      if (!isInitialLoad) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }
  }, [messages.length]); // Cambiar la dependencia para que solo responda a cambios en la cantidad

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const content = inputText;
    setInputText('');
    try {
      // Guardar mensaje en el backend
      await axios.post(`${API_URL}/api/chats/${chatId}/messages`, { content });
      // No agregues el mensaje manualmente al estado, espera a recibirlo por WebSocket
      if (socketRef.current) {
        socketRef.current.emit('send-message', { chatId, content });
      }    } catch (e) {
      // Manejo de error opcional
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View style={[styles.chatContainer, { paddingBottom: Platform.OS === 'android' ? keyboardHeight : 0 }]}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}          renderItem={({ item }) => (
            <View style={[
              styles.messageBubble,
              item.senderId === userId ? styles.messageSent : styles.messageReceived
            ]}>
              <Text style={item.senderId === userId ? styles.textSent : styles.textReceived}>{item.content}</Text>
            </View>
          )}
          contentContainerStyle={styles.messagesContainer}
          style={styles.messagesList}
          keyboardShouldPersistTaps="handled"
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10,
          }}
          onContentSizeChange={() => {
            // Asegurar scroll al final cuando cambie el contenido
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
          onLayout={() => {
            // Scroll al final cuando se renderice el layout
            if (messages.length > 0) {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: false });
              }, 50);
            }
          }}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            onFocus={() => {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 300);
            }}
          />
          <IconButton icon="send" onPress={sendMessage} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5dc' },
  chatContainer: { flex: 1 },
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
