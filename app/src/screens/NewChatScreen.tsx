import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, ActivityIndicator, Text, Modal, Portal, Button, TextInput } from 'react-native-paper';
import axios from 'axios';
import { API_URL, useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Navigation params include NewChat and Chat
type RootStackParamList = {
  NewChat: undefined;
  Chat: { chatId: string; chatName?: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'NewChat'>;

interface UserItem {
  id: string;
  name: string;
  email: string;
}

export default function NewChatScreen() {
  const { authState } = useAuth(); // Obtiene el usuario actual
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [firstMessage, setFirstMessage] = useState('');
  const [sending, setSending] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    axios.get(`${API_URL}/api/users`)
      .then(res => {
        // Filtra el usuario actual
        const filtered = res.data.filter((u: UserItem) => u.id !== authState?.userId);
        setUsers(filtered);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authState?.userId]);

  const handleUserPress = (user: UserItem) => {
    setSelectedUser(user);
    setFirstMessage('');
    setModalVisible(true);
  };

  const handleSend = async () => {
    if (!selectedUser || !firstMessage.trim()) return;
    setSending(true);
    try {
      const response = await axios.post(`${API_URL}/api/chats`, {
        userIds: [selectedUser.id],
        type: 'PRIVATE',
        firstMessageContent: firstMessage.trim()
      });
      const chat = response.data;
      setModalVisible(false);
      navigation.navigate('Chat', { chatId: chat.id, chatName: selectedUser.name || selectedUser.email });
    } catch (err) {
      console.error('Error creating chat', err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name || item.email}
            description={item.email}
            onPress={() => handleUserPress(item)}
            left={props => <List.Icon {...props} icon="account" />}
          />
        )}
      />
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={{ backgroundColor: 'white', margin: 24, padding: 24, borderRadius: 8 }}>
          <Text style={{ marginBottom: 12 }}>Escribe el primer mensaje para {selectedUser?.name || selectedUser?.email}:</Text>
          <TextInput
            label="Mensaje"
            value={firstMessage}
            onChangeText={setFirstMessage}
            autoFocus
            multiline
            style={{ marginBottom: 16 }}
          />
          <Button mode="contained" onPress={handleSend} loading={sending} disabled={!firstMessage.trim() || sending}>
            Enviar y crear chat
          </Button>
          <Button onPress={() => setModalVisible(false)} disabled={sending} style={{ marginTop: 8 }}>
            Cancelar
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
