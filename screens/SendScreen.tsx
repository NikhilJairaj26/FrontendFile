import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import CustomText from '../components/CustomText';
import { useUser } from '../context/UserContext';
import { uploadFile, sendFile } from '../services/fileService';
import * as DocumentPicker from 'expo-document-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

export default function SendScreen() {
  const { user } = useUser();
  const [file, setFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // Handle file selection
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (result.canceled || !result.assets?.length) return;
      const pickedFile = result.assets[0];

      setFile({
        uri: pickedFile.uri,
        name: pickedFile.name || 'file',
        type: pickedFile.mimeType || 'application/octet-stream',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to pick a file');
    }
  };

  // Handle QR Code scanning
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanning(false);
    setRecipientId(data);
    Alert.alert('QR Code Scanned', `Recipient ID: ${data}`);
  };

  // Handle file sending
  const handleSendFile = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to send files');
      return;
    }
    if (!file || !recipientId) {
      Alert.alert('Error', 'Please select a file and scan a recipient QR code first');
      return;
    }

    setLoading(true);
    try {
      const uploadResponse = await uploadFile(file, user.token);
      const sendResponse = await sendFile(uploadResponse.file.id, user.token, recipientId);
      Alert.alert('Success', sendResponse.message);
      setFile(null);
      setRecipientId(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'File transfer failed');
    }
    setLoading(false);
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <CustomText>No access to camera. Please enable permissions in settings.</CustomText>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <CustomText>Grant Camera Permission</CustomText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {scanning ? (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={handleBarCodeScanned}
          />
          <TouchableOpacity style={styles.cancelButton} onPress={() => setScanning(false)}>
            <CustomText style={{ color: 'white' }}>Cancel</CustomText>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={pickFile}>
            <LinearGradient colors={['#4a90e2', '#50b5ff']} style={styles.gradient}>
              <FontAwesome name="file" size={24} color="white" />
              <CustomText>{file ? file.name : 'Select File'}</CustomText>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => setScanning(true)}>
            <LinearGradient colors={['#ff6f61', '#ff9a8b']} style={styles.gradient}>
              <FontAwesome name="qrcode" size={24} color="white" />
              <CustomText>Scan QR Code</CustomText>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSendFile} disabled={loading}>
            <LinearGradient colors={['#34d399', '#059669']} style={styles.gradient}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <FontAwesome name="paper-plane" size={24} color="white" />
                  <CustomText>Send File</CustomText>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  cancelButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 5,
  },
  button: {
    width: '80%',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  gradient: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
