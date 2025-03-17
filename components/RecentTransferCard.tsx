import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Transfer {
  id: number;
  fileName: string;
  fileType?: 'document' | 'image' | 'video' | 'zip' | 'other'; // Explicitly define fileType options
  size: string;
}

interface RecentTransferCardProps {
  transfer: Transfer;
  onPress?: () => void; // Optional onPress handler
}

export default function RecentTransferCard({ transfer, onPress }: RecentTransferCardProps) {
  // Determine the icon based on fileType
  const getIconName = () => {
    switch (transfer.fileType) {
      case 'document':
        return 'file-document-outline';
      case 'image':
        return 'file-image-outline';
      case 'video':
        return 'file-video-outline';
      case 'zip':
        return 'zip-box-outline';
      default:
        return 'file-outline'; // Default icon for unknown or undefined fileType
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={getIconName()}
          size={24}
          color="#4a26fd"
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.fileName} numberOfLines={1}>
          {transfer.fileName}
        </Text>
        <Text style={styles.fileSize}>{transfer.size}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 38, 253, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  fileSize: {
    fontSize: 14,
    color: '#777',
  },
});