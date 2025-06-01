import { CameraView } from "expo-camera";
import React from "react";
import { View,Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ScannerScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <CameraView
                style={{ flex: 1, width: '100%' }}
                facing= "back"
                onBarcodeScanned={(data) => {
                    console.log('Código escaneado:', data);
                }}
            />
        </SafeAreaView>
    );
};

export default ScannerScreen;