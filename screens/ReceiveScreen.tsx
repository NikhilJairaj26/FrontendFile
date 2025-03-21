import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useUser } from '../context/UserContext';
import CustomText from '../components/CustomText';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

export default function ReceiveScreen() {
  const { user } = useUser(); // Ensure user has an `id` property
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user?.id) {
      setQrValue(user.id);
    }
  }, [user]);

  const handleGenerateQr = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User ID not found. Please log in.');
      return;
    }
    setLoading(true);
    try {
      setQrValue(user.id);
      Alert.alert('QR Code Generated', 'Scan this QR code to receive files.');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate QR code.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>Receive Files</CustomText>

      <View style={styles.qrContainer}>
        {qrValue ? (
          <QRCode value={qrValue} size={200} />
        ) : (
          <CustomText style={styles.warning}>No QR Code Available</CustomText>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGenerateQr} disabled={loading}>
        <LinearGradient colors={['#ffb347', '#ffcc33']} style={styles.gradient}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <FontAwesome name="qrcode" size={24} color="white" />
              <CustomText>Generate QR Code</CustomText>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
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
  warning: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
