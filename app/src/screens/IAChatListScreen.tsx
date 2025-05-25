import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Animated, TouchableOpacity, Alert, PanResponder } from 'react-native';
import { List, FAB, ActivityIndicator, Text, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface IAChat {
  id: string;
  title: string;
  messages: { id: string; text: string; sender: 'user' | 'bot' }[];
}

type IAChatType = 'nutrition' | 'training';

type RootStackParamList = {
  IAChatList: { chatType: IAChatType } | undefined;
  IAChatDetail: { chatId: string; chatTitle: string; chatType: IAChatType };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'IAChatList'>;

interface IAChatListScreenProps {
  route?: { params?: { chatType: IAChatType } };
}

const getStorageKey = (chatType: IAChatType) =>
  chatType === 'nutrition' ? 'iaChats_nutrition' : 'iaChats_training';

// Componente de chat item con swipe para eliminar
const SwipeableChatItem = ({ 
  item, 
  onPress, 
  onDelete 
}: { 
  item: IAChat; 
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
      if (gestureState.dx < 0) { // Solo permitir swipe hacia la izquierda
        translateX.setValue(Math.max(gestureState.dx, -80));
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -50) {
        // Mostrar botón de eliminar
        Animated.spring(translateX, {
          toValue: -80,
          useNativeDriver: true,
        }).start();
      } else {
        // Volver a posición original
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
            // Volver a posición original
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
          <IconButton icon="delete" iconColor="#fff" size={24} />
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
          title={item.title}
          description={item.messages.length ? item.messages[item.messages.length - 1].text : 'Sin mensajes'}
          onPress={onPress}
          left={props => <List.Icon {...props} icon="chat" />}
          style={styles.listItem}
        />
      </Animated.View>
    </View>
  );
};

const IAChatListScreen = ({ route }: IAChatListScreenProps) => {
  const chatType: IAChatType = route?.params?.chatType || 'nutrition';
  const [chats, setChats] = useState<IAChat[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const loadChats = async () => {
      setLoading(true);
      const storedChats = await AsyncStorage.getItem(getStorageKey(chatType));
      if (storedChats) {
        setChats(JSON.parse(storedChats));
      } else {
        setChats([]);
      }
      setLoading(false);
    };
    loadChats();
  }, [chatType]);
  const createNewChat = async () => {
    const newChat: IAChat = {
      id: Date.now().toString(),
      title: chatType === 'nutrition' ? 'Nuevo Chat Nutrición' : 'Nuevo Chat Entrenamiento',
      messages: [],
    };
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    await AsyncStorage.setItem(getStorageKey(chatType), JSON.stringify(updatedChats));
    navigation.navigate('IAChatDetail', { chatId: newChat.id, chatTitle: newChat.title, chatType });
  };

  const deleteChat = async (chatId: string) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    await AsyncStorage.setItem(getStorageKey(chatType), JSON.stringify(updatedChats));
  };

  const renderItem = ({ item }: { item: IAChat }) => (
    <SwipeableChatItem
      item={item}
      onPress={() => navigation.navigate('IAChatDetail', { chatId: item.id, chatTitle: item.title, chatType })}
      onDelete={() => deleteChat(item.id)}
    />
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No tienes chats aún.</Text>}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={createNewChat}
      />
    </View>
  );
};

export default IAChatListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5dc' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', marginTop: 20 },
  fab: {
    position: 'absolute',
    bottom: 16,
    left: 16,
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
});