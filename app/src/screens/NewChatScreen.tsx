import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, ActivityIndicator, Text } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../../context/AuthContext';
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
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    axios.get(`${API_URL}/api/users`)
      .then(res => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <List.Item
          title={item.name || item.email}
          description={item.email}
          onPress={async () => {
            try {
              const response = await axios.post(`${API_URL}/api/chats`, {
                userIds: [item.id],
                type: 'PRIVATE'
              });
              const chat = response.data;
              navigation.navigate('Chat', { chatId: chat.id, chatName: item.name || item.email });
            } catch (err) {
              console.error('Error creating chat', err);
            }
          }}
          left={props => <List.Icon {...props} icon="account" />}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
