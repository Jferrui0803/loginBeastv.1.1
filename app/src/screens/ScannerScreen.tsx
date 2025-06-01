import { CameraView } from "expo-camera";
import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { MainStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const ScannerScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleBarcodeScanned = (data: any) => {
        console.log('Código escaneado:', data);
 
        if (data) {
            navigation.goBack();
        }
    };
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <CameraView
                style={{ flex: 1, width: '100%' }}
                facing= "back"
                onBarcodeScanned={handleBarcodeScanned}
            />
        </SafeAreaView>
    );
};

export default ScannerScreen;