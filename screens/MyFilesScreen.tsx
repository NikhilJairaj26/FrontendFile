import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';

// Sample File Data (Replace this with your actual data source)
const myFiles = [
  {
    id: 1,
    fileName: 'Document.pdf',
    fileType: 'document',
    fileSize: '1.5 MB',
    dateAdded: '2024-02-01T12:00:00Z',
    thumbnail: null,
  },
  {
    id: 2,
    fileName: 'Image.jpg',
    fileType: 'image',
    fileSize: '2.3 MB',
    dateAdded: '2024-02-02T14:30:00Z',
    thumbnail: null,
  },
  {
    id: 3,
    fileName: 'Video.mp4',
    fileType: 'video',
    fileSize: '50 MB',
    dateAdded: '2024-02-03T16:45:00Z',
    thumbnail: null,
  },
];

// Type definitions for files
interface FileItem {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: string;
  dateAdded: string;
  thumbnail: string | null;
}

export default function MyFilesScreen() {
  const navigation = useNavigation();
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<'date' | 'name' | 'size'>('date');

  // Sorting files based on sortOrder
  const sortedFiles = [...myFiles].sort((a, b) => {
    if (sortOrder === 'date') {
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    } else if (sortOrder === 'name') {
      return a.fileName.localeCompare(b.fileName);
    } else if (sortOrder === 'size') {
      return parseFloat(b.fileSize) - parseFloat(a.fileSize);
    }
    return 0;
  });

  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(fileId)
        ? prevSelected.filter((id) => id !== fileId)
        : [...prevSelected, fileId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedFiles(selectedFiles.length === myFiles.length ? [] : myFiles.map((file) => file.id));
  };

  const changeSortOrder = (order: 'date' | 'name' | 'size') => {
    setSortOrder(order);
    toast(`Sorted by ${order}`);
  };

  const deleteSelectedFiles = () => {
    if (selectedFiles.length === 0) {
      toast.error('No files selected');
      return;
    }
    toast.success(`${selectedFiles.length} files deleted`);
    setSelectedFiles([]);
  };

  const renderFileItem = ({ item }: { item: FileItem }) => {
    const isSelected = selectedFiles.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.fileItem, isSelected && styles.fileItemSelected]}
        onPress={() => toggleFileSelection(item.id)}
      >
        <View style={styles.fileIconContainer}>
          {item.thumbnail ? (
            <Image source={{ uri: item.thumbnail }} style={styles.fileThumbnail} />
          ) : (
            <MaterialCommunityIcons
              name={
                item.fileType === 'document' ? 'file-document-outline' :
                item.fileType === 'image' ? 'file-image-outline' :
                item.fileType === 'video' ? 'file-video-outline' :
                item.fileType === 'zip' ? 'zip-box-outline' : 'file-outline'
              }
              size={28}
              color="#4a26fd"
            />
          )}
        </View>

        <View style={styles.fileDetails}>
          <Text style={styles.fileName} numberOfLines={1}>{item.fileName}</Text>
          <Text style={styles.fileInfo}>
            {item.fileSize} · {new Date(item.dateAdded).toLocaleDateString()}
          </Text>
        </View>

        {isSelected ? (
          <Ionicons name="checkmark-circle" size={24} color="#4a26fd" />
        ) : (
          <Feather name="more-vertical" size={20} color="#777" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Files</Text>
        <TouchableOpacity onPress={toggleSelectAll}>
          <Text style={styles.selectAllText}>
            {selectedFiles.length ?
              selectedFiles.length === myFiles.length ? 'Deselect All' : `${selectedFiles.length} Selected`
              : 'Select'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Files List */}
      <FlatList
        data={sortedFiles}
        renderItem={renderFileItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.filesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Delete Button */}
      {selectedFiles.length > 0 && (
        <TouchableOpacity style={styles.deleteButton} onPress={deleteSelectedFiles}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  selectAllText: { fontSize: 14, color: '#4a26fd', fontWeight: '500' },
  filesList: { paddingHorizontal: 20, paddingBottom: 20 },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
    backgroundColor: 'white',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fileItemSelected: { backgroundColor: 'rgba(74, 38, 253, 0.1)' },
  fileIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 38, 253, 0.1)',
  },
  fileThumbnail: { width: 50, height: 50, borderRadius: 12 },
  fileDetails: { flex: 1, marginLeft: 15 },
  fileName: { fontSize: 16, fontWeight: '500', color: '#333' },
  fileInfo: { fontSize: 13, color: '#777', marginTop: 4 },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff5858',
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  deleteText: { color: '#fff', fontWeight: '500', marginLeft: 5 },
});