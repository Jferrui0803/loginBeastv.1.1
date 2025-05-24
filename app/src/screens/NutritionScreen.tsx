import React, { useState } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, IconButton } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../../context/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function NutritionScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    const pregunta = inputText;
    setInputText('');
    try {
      const response = await axios.post(`${API_URL}/api/ia/consultar`, { pregunta });
      const botText = response.data.respuesta || response.data.answer || '';
      const botMsg: Message = { id: (Date.now() + 1).toString(), text: botText, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errMsg: Message = { id: (Date.now() + 2).toString(), text: 'Error al comunicar con el servidor.', sender: 'bot' };
      setMessages(prev => [...prev, errMsg]);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'user' ? styles.user : styles.bot]}>
            <Text>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu pregunta..."
          value={inputText}
          onChangeText={setInputText}
        />
        <IconButton icon="send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5dc' },
  messagesContainer: { padding: 16 },
  message: { padding: 12, borderRadius: 8, marginVertical: 4, maxWidth: '80%' },
  user: { alignSelf: 'flex-end', backgroundColor: '#ffa500' },
  bot: { alignSelf: 'flex-start', backgroundColor: '#fff' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 8, borderTopWidth: 1, borderColor: '#ccc', backgroundColor: '#f5f5dc' },
  input: { flex: 1, backgroundColor: '#fff', marginRight: 8 },
});
