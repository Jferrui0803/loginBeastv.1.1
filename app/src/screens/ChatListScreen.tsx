import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Animated, TouchableOpacity, Alert, PanResponder, RefreshControl } from 'react-native';
import { List, ActivityIndicator, Text, FAB } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import io from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { useIsFocused } from '@react-navigation/native';

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
  otherUserName?: string; // nombre del otro usuario
  lastMessage?: string;   // último mensaje del chat
  hasUnread?: boolean; // Nuevo campo para notificación
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
  swipeContainer: {
    position: 'relative',
    marginVertical: 2,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  deleteButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatItemContainer: {
    backgroundColor: '#fff',
    zIndex: 2,
  },
  listItem: {
    backgroundColor: '#fff',
  },
  unreadDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ffa500',
    marginRight: 12,
    alignSelf: 'center',
  },
});

const SwipeableChatItem = ({
  item,
  onPress,
  onDelete
}: {
  item: ChatItem;
  onPress: () => void;
  onDelete: () => void;
}) => {
  const translateX = new Animated.Value(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx < 0) {
        translateX.setValue(Math.max(gestureState.dx, -80));
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -50) {
        Animated.spring(translateX, {
          toValue: -80,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Chat',
      '¿Estás seguro de que quieres eliminar este chat? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setIsDeleting(true);
            onDelete();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.swipeContainer}>
      <View style={styles.deleteButton}>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButtonInner}>
          <List.Icon icon="delete" color="#fff" />
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[
          styles.chatItemContainer,
          { transform: [{ translateX }] }
        ]}
        {...panResponder.panHandlers}
      >
        <List.Item
          title={item.otherUserName || `Chat: ${item.id}`}
          description={item.lastMessage || ''}
          onPress={onPress}
          left={props => <List.Icon {...props} icon="chat" />}
          right={() => item.hasUnread ? (
            <View style={styles.unreadDot} />
          ) : null}
          style={styles.listItem}
        />
      </Animated.View>
    </View>
  );
};

export default function ChatListScreen() {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const { authState } = useAuth();
  const isFocused = useIsFocused();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (!authState?.userId || !authState?.token) return;
    const socket = io(API_URL, {
      auth: { token: authState.token }
    });
    socket.emit('join-user', authState.userId);
    socket.on('receive-message', (message) => {
      setChats(prevChats => prevChats.map(chat =>
        chat.id === message.chatId
          ? { ...chat, lastMessage: message.content, hasUnread: true }
          : chat
      ));
    });
    return () => {
      socket.disconnect();
    };
  }, [authState?.userId, authState?.token]);

  useEffect(() => {
    if (isFocused && activeChatId) {
      setChats(prevChats => prevChats.map(chat =>
        chat.id === activeChatId ? { ...chat, hasUnread: false } : chat
      ));
      setActiveChatId(null);
    }
  }, [isFocused]);

  const loadChats = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/chats`);
      setChats(res.data);
    } catch {
      // Error silenciado
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const start = Date.now();
    await loadChats();
    const elapsed = Date.now() - start;
    // Mantener el spinner al menos 400ms para evitar parpadeos
    if (elapsed < 400) {
      setTimeout(() => setRefreshing(false), 400 - elapsed);
    } else {
      setRefreshing(false);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      await axios.delete(`${API_URL}/api/chats/${chatId}`);
      setChats(prev => prev.filter(chat => chat.id !== chatId));
    } catch {}
  };

  const handleChatPress = (chatId: string, chatName?: string) => {
    setActiveChatId(chatId);
    setChats(prevChats => prevChats.map(chat =>
      chat.id === chatId ? { ...chat, hasUnread: false } : chat
    ));
    navigation.navigate('Chat', { chatId, chatName });
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      ) : !chats.length ? (
        <View style={styles.empty}>
          <Text>No tienes chats aún.</Text>
        </View>      ) : (
        <FlatList
          data={chats}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <SwipeableChatItem
              item={item}
              onPress={() => handleChatPress(item.id, item.otherUserName || `Chat: ${item.id}`)}
              onDelete={() => deleteChat(item.id)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#ffa500"]}
              progressBackgroundColor="#f5f5dc"
            />
          }
          scrollEventThrottle={16}
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
