import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { toast } from 'sonner-native';
import { uploadFile } from '../services/fileService';
import { useUser } from '../context/UserContext';

export default function SendScreen() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickFile = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setFileUri(result.assets[0].uri);
      toast.success('File selected');
    }
  };

  const handleUpload = async () => {
    if (!fileUri || !user?.token) {
      toast.error('No file selected or user not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      const response = await uploadFile(fileUri, user.token);
      setQrImageUrl(response.qrCodeUrl);
      toast.success('File uploaded successfully!');
    } catch (err) {
      console.error('Error uploading file:', err);
      toast.error('Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Files</Text>
        <View style={styles.placeholder} />
      </View>

      {/* File Picker */}
      <TouchableOpacity style={styles.filePicker} onPress={pickFile}>
        <Text style={styles.filePickerText}>Pick a File to Send</Text>
      </TouchableOpacity>

      {/* Upload Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.uploadButtonText}>Upload File</Text>
        )}
      </TouchableOpacity>

      {/* QR Code Display */}
      {qrImageUrl && (
        <View style={styles.qrContainer}>
          <Text style={styles.qrTitle}>Scan QR Code to Receive File</Text>
          <Image source={{ uri: qrImageUrl }} style={styles.qrCode} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  filePicker: {
    padding: 15,
    backgroundColor: '#4a26fd',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  filePickerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButton: {
    padding: 15,
    backgroundColor: '#11998e',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  qrCode: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});