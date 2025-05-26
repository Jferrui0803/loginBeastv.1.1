import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Animated, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { TextInput, IconButton, Text, ActivityIndicator, Button, Chip } from 'react-native-paper';
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
  description?: string;
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

// Componente para las preguntas predefinidas
const PredefinedQuestions = ({ 
  chatType, 
  onQuestionPress 
}: { 
  chatType: IAChatType; 
  onQuestionPress: (question: string) => void;
}) => {
  const nutritionQuestions = [
    "Hazme una dieta para perder peso",
    "Hazme una dieta para ganar peso",
    "¿Qué alimentos debo evitar para adelgazar?",
    "Dame un plan de comidas saludables",
    "¿Cuántas calorías necesito al día?",
    "Alimentos ricos en proteínas",
    "¿Qué puedo comer antes de entrenar?",
    "Recetas saludables para el desayuno",
    "¿Qué snacks saludables puedo comer?",
    "¿Cómo puedo aumentar mi masa muscular con la dieta?",
    "¿Qué alimentos ayudan a la recuperación muscular?",
    "¿Qué puedo cenar si quiero bajar de peso?",
    "¿Cómo organizar mis comidas durante el día?"
  ];

  const trainingQuestions = [
    "Rutina de ejercicios para principiantes",
    "Ejercicios para ganar masa muscular",
    "Rutina de cardio para quemar grasa",
    "¿Cuántos días debo entrenar a la semana?",
    "Ejercicios para trabajar abdominales",
    "Rutina de entrenamiento en casa",
    "¿Cómo mejorar mi resistencia?",
    "Ejercicios para fortalecer la espalda",
    "¿Qué ejercicios puedo hacer sin equipamiento?",
    "¿Cómo calentar antes de entrenar?",
    "¿Qué estiramientos debo hacer después de entrenar?",
    "Rutina para tonificar todo el cuerpo",
    "¿Cómo evitar lesiones al entrenar?",
    "¿Qué ejercicios ayudan a perder grasa abdominal?",
    "¿Cómo organizar una semana de entrenamiento?"
  ];

  const questions = chatType === 'nutrition' ? nutritionQuestions : trainingQuestions;

  return (
    <View style={styles.predefinedQuestionsContainer}>
      <Text style={styles.predefinedQuestionsTitle}>
        Preguntas rápidas:
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.questionsScrollView}
      >
        {questions.map((question, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={() => onQuestionPress(question)}
            style={styles.questionChip}
          >
            <Text style={styles.questionChipText}>{question}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const IAChatDetailScreen = () => {
  const route = useRoute<ChatRouteProp>();
  const { chatId, chatTitle, chatType } = route.params;
  const [chat, setChat] = useState<IAChat | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<any>(null);

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
  }, [chatId, chatType]);  const sendMessage = async () => {
    if (!inputText.trim() || !chat || isLoading) return;
    setIsLoading(true);
    const userMsg: Message = { id: Date.now().toString(), text: inputText, sender: 'user' };
    const typingMsg: Message = { id: 'typing', text: 'Escribiendo...', sender: 'bot', isTyping: true };
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
      let finalChat: IAChat;
      // Si es el primer mensaje, actualiza título y descripción
      if (chat.messages.length === 0) {
        finalChat = { ...updatedChatWithUser, title: userMsg.text, description: botText, messages: [...updatedChatWithUser.messages, botMsg] };
      } else {
        finalChat = { ...updatedChatWithUser, messages: [...updatedChatWithUser.messages, botMsg] };
      }
      setChat(finalChat);
      chats = chats.map(c => (c.id === chatId ? finalChat : c));
      await AsyncStorage.setItem(getStorageKey(chatType), JSON.stringify(chats));
    } catch (error) {
      const errMsg: Message = { id: (Date.now() + 2).toString(), text: 'Error al comunicar con el servidor.', sender: 'bot' };
      let finalChat: IAChat;
      if (chat.messages.length === 0) {
        finalChat = { ...updatedChatWithUser, title: userMsg.text, description: errMsg.text, messages: [...updatedChatWithUser.messages, errMsg] };
      } else {
        finalChat = { ...updatedChatWithUser, messages: [...updatedChatWithUser.messages, errMsg] };
      }
      setChat(finalChat);
      chats = chats.map(c => (c.id === chatId ? finalChat : c));
      await AsyncStorage.setItem(getStorageKey(chatType), JSON.stringify(chats));
    } finally {
      setIsLoading(false);
    }
  };
  const handlePredefinedQuestionPress = (question: string) => {
    setInputText(question);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
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

      {/* Preguntas predefinidas SIEMPRE visibles encima del input */}
      {(chatType === 'nutrition' || chatType === 'training') && (
        <PredefinedQuestions 
          chatType={chatType} 
          onQuestionPress={handlePredefinedQuestionPress} 
        />
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Escribe tu mensaje..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
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
  predefinedQuestionsContainer: {
    padding: 16,
    backgroundColor: '#f5f5dc',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  predefinedQuestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  questionsScrollView: {
    flexDirection: 'row',
  },
  questionChip: {
    marginRight: 8,
    backgroundColor: '#fff',
    borderColor: '#ffa500',
    padding: 8,
    borderRadius: 16,
  },
  questionChipText: {
    fontSize: 12,
    color: '#ffa500',
  },
});