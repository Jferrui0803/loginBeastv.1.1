import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, ActivityIndicator, Text, FAB } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define navigation params same as in HomeScreen
type RootStackParamList = {
  ChatList: undefined;
  Chat: { chatId: string; chatName?: string };
  NewChat: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChatList'>;

interface ChatItem {
  id: string;
  type: string;
  // add more fields if needed
}

export default function ChatListScreen() {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    axios.get(`${API_URL}/api/chats`)
      .then(res => {
        setChats(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      ) : !chats.length ? (
        <View style={styles.empty}>
          <Text>No tienes chats aún.</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={`Chat: ${item.id}`}
              description={item.type}
              onPress={() => navigation.navigate('Chat', { chatId: item.id, chatName: item.type })}
              left={props => <List.Icon {...props} icon="chat" />}
            />
          )}
        />
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('NewChat')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#ffa500',
  },
});
