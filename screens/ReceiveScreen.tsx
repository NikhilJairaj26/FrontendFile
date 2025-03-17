import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as FileSystem from 'expo-file-system';
import { toast } from 'sonner-native';

const { width } = Dimensions.get('window');
const QR_SIZE = width * 0.7;

type FileType = 'document' | 'image' | 'video' | 'zip';
type DownloadStage = 'waiting' | 'downloading' | 'complete' | 'error';

interface FileDetails {
  name: string;
  size: string;
  sender: string;
  type: FileType;
}

export default function ReceiveScreen() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [deviceActive, setDeviceActive] = useState(true);
  const [qrImageUrl] = useState('https://api.a0.dev/assets/image?text=QR%20code%20example&aspect=1:1');
  const [scanningAnimation, setScanningAnimation] = useState<string | Animatable.CustomAnimation | null>(null);
  const [receiveModalVisible, setReceiveModalVisible] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStage, setDownloadStage] = useState<DownloadStage>('waiting');
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Simulate file discovery when scanning
  useEffect(() => {
    if (isScanning) {
      const timeout = setTimeout(() => {
        setIsScanning(false);

        // Simulate finding a file
        setFileDetails({
          name: 'Project Presentation.pptx',
          size: '12.3 MB',
          sender: 'David Kim',
          type: 'document',
        });

        setReceiveModalVisible(true);
        setDownloadStage('waiting');
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isScanning]);

  const toggleScanning = () => {
    if (!isScanning) {
      setIsScanning(true);
      setScanningAnimation({
        0: { opacity: 0.1 },
        0.5: { opacity: 0.5 },
        1: { opacity: 0.1 },
      });
      toast('Scanning cloud for available transfers...', {
        duration: 2000,
      });
    } else {
      setIsScanning(false);
      setScanningAnimation(null);
      toast('Scanning cancelled');
    }
  };

  const startDownload = async () => {
    setDownloadStage('downloading');
    setDownloadProgress(0);

    // Simulate download progress
    const downloadInterval = setInterval(() => {
      setDownloadProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(downloadInterval);
          setDownloadProgress(100);
          setDownloadStage('complete');

          // Navigate away after completion
          setTimeout(() => {
            setReceiveModalVisible(false);
            toast.success('File received successfully!');
            navigation.navigate('Home' as never);
          }, 1500);

          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const declineTransfer = () => {
    setReceiveModalVisible(false);
    toast('Transfer declined');
  };

  const toggleDeviceVisibility = () => {
    setDeviceActive(!deviceActive);
    if (!deviceActive) {
      toast.success('Your device is now visible to others');
    } else {
      toast('Your device is now hidden');
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setIsScanning(false);
    toast.success(`Scanned QR code with data: ${data}`);
    // Implement file transfer logic here
  };

  const renderReceiveModalContent = () => {
    return (
      <View style={styles.receiveModalContent}>
        {/* File icon based on type */}
        <View style={styles.fileIconContainer}>
          {downloadStage === 'waiting' && (
            <MaterialCommunityIcons
              name={
                fileDetails?.type === 'document'
                  ? 'file-document-outline'
                  : fileDetails?.type === 'image'
                  ? 'file-image-outline'
                  : fileDetails?.type === 'video'
                  ? 'file-video-outline'
                  : fileDetails?.type === 'zip'
                  ? 'zip-box-outline'
                  : 'file-outline'
              }
              size={50}
              color="#4a26fd"
            />
          )}
          {downloadStage === 'downloading' && (
            <Animatable.View animation="pulse" iterationCount="infinite" duration={1500}>
              <FontAwesome5 name="cloud-download-alt" size={50} color="#4a26fd" />
            </Animatable.View>
          )}
          {downloadStage === 'complete' && (
            <Animatable.View animation="bounceIn">
              <FontAwesome5 name="check-circle" size={50} color="#11998e" />
            </Animatable.View>
          )}
        </View>

        {/* File info */}
        <Text style={styles.receiveFileName}>{fileDetails?.name}</Text>
        <Text style={styles.receiveFileInfo}>
          {fileDetails?.size} · From: {fileDetails?.sender}
        </Text>

        {/* Progress bar for downloading stage */}
        {downloadStage === 'downloading' && (
          <View style={styles.receiveProgressContainer}>
            <View style={[styles.receiveProgressBar, { width: `${downloadProgress}%` }]} />
            <Text style={styles.receiveProgressText}>
              {Math.round(downloadProgress)}% Downloaded from Cloud
            </Text>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.receiveActions}>
          {downloadStage === 'waiting' && (
            <>
              <TouchableOpacity style={styles.receiveActionButton} onPress={startDownload}>
                <Text style={styles.receiveActionButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.receiveActionButtonSecondary}
                onPress={declineTransfer}
              >
                <Text style={styles.receiveActionButtonTextSecondary}>Decline</Text>
              </TouchableOpacity>
            </>
          )}

          {downloadStage === 'downloading' && (
            <TouchableOpacity
              style={styles.receiveActionButtonSecondary}
              onPress={declineTransfer}
            >
              <Text style={styles.receiveActionButtonTextSecondary}>Cancel</Text>
            </TouchableOpacity>
          )}

          {downloadStage === 'complete' && (
            <TouchableOpacity
              style={styles.receiveActionButton}
              onPress={() => {
                setReceiveModalVisible(false);
                navigation.navigate('Home' as never);
              }}
            >
              <Text style={styles.receiveActionButtonText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (hasPermission === null) {
    return <ActivityIndicator size="large" color="#4a26fd" />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receive Files</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Cloud Transfer Badge */}
      <View style={styles.cloudBadge}>
        <FontAwesome5 name="cloud" size={14} color="#4a26fd" />
        <Text style={styles.cloudBadgeText}>Cloud Transfer Enabled</Text>
      </View>

      {/* Device Status */}
      <View
        style={[
          styles.deviceStatus,
          { backgroundColor: deviceActive ? 'rgba(17, 153, 142, 0.1)' : 'rgba(255, 88, 88, 0.1)' },
        ]}
      >
        <Feather
          name={deviceActive ? 'wifi' : 'wifi-off'}
          size={18}
          color={deviceActive ? '#11998e' : '#ff5858'}
        />
        <Text
          style={[
            styles.deviceStatusText,
            { color: deviceActive ? '#11998e' : '#ff5858' },
          ]}
        >
          {deviceActive ? 'Your cloud access is active' : 'Your cloud access is paused'}
        </Text>
        <TouchableOpacity onPress={toggleDeviceVisibility}>
          <Text style={styles.toggleText}>{deviceActive ? 'Pause' : 'Activate'}</Text>
        </TouchableOpacity>
      </View>

      {/* QR Code Section */}
      <View style={styles.qrContainer}>
        <Text style={styles.qrTitle}>Access Your Files in the Cloud</Text>
        <Text style={styles.qrSubtitle}>
          Scan this QR code with any device to access your files in the cloud
        </Text>

        <View style={styles.qrWrapper}>
          {isScanning && (
            <Animatable.View
              animation={scanningAnimation as string | Animatable.CustomAnimation}
              iterationCount="infinite"
              duration={2000}
              style={styles.scanningOverlay}
            />
          )}
          <Image source={{ uri: qrImageUrl }} style={styles.qrCode} />
        </View>

        <View style={styles.deviceInfo}>
          <FontAwesome5 name="cloud" size={18} color="#4a26fd" />
          <Text style={styles.deviceName}>Your Cloud Storage ID: 473829</Text>
        </View>
      </View>

      {/* OR Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Scan Button */}
      <View style={styles.scanButtonContainer}>
        <TouchableOpacity style={styles.scanButton} onPress={toggleScanning}>
          <LinearGradient
            colors={isScanning ? ['#ff5858', '#f857a6'] : ['#11998e', '#38ef7d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.scanButtonGradient}
          >
            <Text style={styles.scanButtonText}>
              {isScanning ? 'Cancel Scanning' : 'Check Cloud for Files'}
            </Text>
            <FontAwesome5
              name={isScanning ? 'times-circle' : 'cloud-download-alt'}
              size={18}
              color="white"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Help Text */}
      <Text style={styles.helpText}>
        Files sent to you will be securely stored in the cloud for 7 days
      </Text>

      {/* QR Code Scanner */}
      {isScanning && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {/* Receive Modal */}
      <Modal
        visible={receiveModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setReceiveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>{renderReceiveModalContent()}</View>
        </View>
      </Modal>
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
  cloudBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgba(74, 38, 253, 0.08)',
  },
  cloudBadgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4a26fd',
    marginLeft: 6,
  },
  deviceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 0,
  },
  deviceStatusText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  toggleText: {
    fontSize: 14,
    color: '#4a26fd',
    fontWeight: '500',
  },
  qrContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  qrTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  qrSubtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: '80%',
  },
  qrWrapper: {
    width: QR_SIZE,
    height: QR_SIZE,
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#4a26fd',
    zIndex: 1,
  },
  qrCode: {
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    paddingHorizontal: 15,
    color: '#777',
    fontSize: 14,
    fontWeight: '500',
  },
  scanButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scanButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  scanButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  helpText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#777',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  receiveModalContent: {
    padding: 25,
    alignItems: 'center',
  },
  fileIconContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  receiveFileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  receiveFileInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  receiveProgressContainer: {
    width: '100%',
    marginBottom: 20,
  },
  receiveProgressBar: {
    height: 8,
    backgroundColor: '#4a26fd',
    borderRadius: 4,
    marginBottom: 8,
  },
  receiveProgressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  receiveActions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  receiveActionButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#4a26fd',
    borderRadius: 10,
    minWidth: 110,
    alignItems: 'center',
  },
  receiveActionButtonSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    minWidth: 110,
    alignItems: 'center',
  },
  receiveActionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  receiveActionButtonTextSecondary: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 15,
  },
});