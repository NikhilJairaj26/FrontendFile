import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text } from 'react-native';
import CustomText from '../components/CustomText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';

// Define strict TypeScript type
interface TransferItem {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: string;
  direction: 'sent' | 'received'; // STRICT TYPE ENFORCEMENT
  date: string;
  recipient?: string | null;
  thumbnail?: string | null;
}

// Ensure mock data follows correct types
const fullHistory: TransferItem[] = [
  {
    id: 1,
    fileName: 'Report.pdf',
    fileType: 'document',
    fileSize: '1.2 MB',
    direction: 'sent', // 👈 Correct type
    date: '2 days ago',
    recipient: 'John Doe',
    thumbnail: null,
  },
  {
    id: 2,
    fileName: 'Photo.jpg',
    fileType: 'image',
    fileSize: '2.5 MB',
    direction: 'received', // 👈 Correct type
    date: '3 days ago',
    recipient: null,
    thumbnail: 'image_url',
  },
  {
    id: 3,
    fileName: 'Music.mp3',
    fileType: 'audio',
    fileSize: '4.3 MB',
    direction: 'sent',
    date: '1 week ago',
    recipient: 'Music Library',
    thumbnail: null,
  },
];

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [filterType, setFilterType] = useState<'all' | 'sent' | 'received'>('all');

  const filteredHistory =
    filterType === 'all'
      ? fullHistory
      : fullHistory.filter((item) => item.direction === filterType);

  const renderTransferItem = ({ item }: { item: TransferItem }) => {
    const isSent = item.direction === 'sent';

    return (
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => toast.success(`Viewing details for ${item.fileName}`)}
      >
        <View
          style={[
            styles.directionIndicator,
            { backgroundColor: isSent ? 'rgba(74, 38, 253, 0.1)' : 'rgba(17, 153, 142, 0.1)' },
          ]}
        >
          <Ionicons name={isSent ? 'arrow-up' : 'arrow-down'} size={18} color={isSent ? '#4a26fd' : '#11998e'} />
        </View>

        <View style={styles.fileDetails}>
          <Text style={styles.fileName} numberOfLines={1}>{item.fileName}</Text>
          <Text style={styles.fileInfo}>
            {item.fileSize} · {item.date}
            {isSent && item.recipient ? ` · To: ${item.recipient}` : ''}
          </Text>
        </View>

        <MaterialCommunityIcons
          name={
            item.fileType === 'document' ? 'file-document-outline' :
            item.fileType === 'image' ? 'file-image-outline' :
            item.fileType === 'video' ? 'file-video-outline' :
            item.fileType === 'audio' ? 'file-music-outline' :
            item.fileType === 'zip' ? 'zip-box-outline' : 'file-outline'
          }
          size={24}
          color="#777"
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>Transfer History</CustomText>
        <TouchableOpacity onPress={() => toast.success('Transfer history cleared')}>
          <CustomText style={styles.clearText}>Clear</CustomText>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {['all', 'sent', 'received'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterTab, filterType === type && styles.activeFilterTab]}
            onPress={() => setFilterType(type as 'all' | 'sent' | 'received')}
          >
            <CustomText style={[styles.filterText, filterType === type && styles.activeFilterText]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>

      {/* History List */}
      <FlatList
        data={filteredHistory}
        renderItem={renderTransferItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.historyList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="history" size={60} color="#ddd" />
            <CustomText style={styles.emptyText}>No transfer history found</CustomText>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// Styles
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
  clearText: {
    fontSize: 14,
    color: '#ff5858',
    fontWeight: '500',
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  activeFilterTab: {
    backgroundColor: 'rgba(74, 38, 253, 0.1)',
  },
  filterText: {
    fontSize: 14,
    color: '#777',
  },
  activeFilterText: {
    color: '#4a26fd',
    fontWeight: '500',
  },
  historyList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  directionIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  fileInfo: {
    fontSize: 13,
    color: '#777',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#777',
  },
});