import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import CustomText from '../components/CustomText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import RecentTransferCard from '../components/RecentTransferCard';
import { getRecentTransfers } from '../services/fileService';
import { HomeScreenNavigationProp } from '../types';
import { useUser } from '../context/UserContext.tsx'; // Assuming you have a UserContext for managing user state

// Define the type for recent transfers
interface Transfer {
  id: number;
  fileName: string;
  size: string;
  fileType?: 'document' | 'image' | 'video' | 'zip';
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [transferSpeed, setTransferSpeed] = useState<string>('12.5 MB/s');
  const [recentTransfers, setRecentTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser(); // Get user token from context

  // Fetch recent transfers from the backend
  useEffect(() => {
    const fetchRecentTransfers = async () => {
      try {
        if (!user?.token) {
          throw new Error('User not authenticated');
        }

        const data = await getRecentTransfers(user.token);
        setRecentTransfers(data);
      } catch (err) {
        console.error('Error fetching recent transfers:', err);
        setError('Failed to load recent transfers. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentTransfers();
  }, [user?.token]);

  const navigateToScreen = (screenName: string) => {
    navigation.navigate(screenName as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient
        colors={['#4a26fd', '#b721ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <CustomText style={styles.headerTitle}>TransferPro</CustomText>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigateToScreen('Profile')}
          >
            <MaterialCommunityIcons name="account-circle" size={32} color="white" />
          </TouchableOpacity>
        </View>
        <CustomText style={styles.headerSubtitle}>Fast, secure file transfers</CustomText>
      </LinearGradient>

      {/* Main Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigateToScreen('Send')}
        >
          <LinearGradient colors={['#00c6ff', '#0072ff']} style={styles.actionGradient}>
            <FontAwesome5 name="paper-plane" size={24} color="white" />
          </LinearGradient>
          <CustomText style={styles.actionText}>Send Files</CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigateToScreen('Receive')}
        >
          <LinearGradient colors={['#11998e', '#38ef7d']} style={styles.actionGradient}>
            <FontAwesome5 name="download" size={24} color="white" />
          </LinearGradient>
          <CustomText style={styles.actionText}>Receive Files</CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigateToScreen('MyFiles')}
        >
          <LinearGradient colors={['#f857a6', '#ff5858']} style={styles.actionGradient}>
            <FontAwesome5 name="folder" size={24} color="white" />
          </LinearGradient>
          <CustomText style={styles.actionText}>My Files</CustomText>
        </TouchableOpacity>
      </View>

      {/* Transfer Speed */}
      <View style={styles.speedContainer}>
        <Ionicons name="speedometer-outline" size={22} color="#4a26fd" />
        <CustomText style={styles.speedText}>{`Current Transfer Speed: ${transferSpeed}`}</CustomText>
      </View>

      {/* Recent Transfers */}
      <View style={styles.recentContainer}>
        <View style={styles.sectionHeader}>
          <CustomText style={styles.sectionTitle}>Recent Transfers</CustomText>
          <TouchableOpacity onPress={() => navigateToScreen('History')}>
            <CustomText style={styles.seeAllText}>See All</CustomText>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#4a26fd" style={styles.loadingIndicator} />
        ) : error ? (
          <CustomText style={styles.errorText}>{error}</CustomText>
        ) : (
          <FlatList<Transfer>
            data={recentTransfers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <RecentTransferCard transfer={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.transfersList}
            ListEmptyComponent={
              <CustomText style={styles.emptyText}>No recent transfers found.</CustomText>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  profileButton: {
    padding: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: -25,
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionGradient: {
    width: 65,
    height: 65,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  speedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 38, 253, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 12,
  },
  speedText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4a26fd',
    fontWeight: '500',
  },
  recentContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4a26fd',
    fontWeight: '500',
  },
  transfersList: {
    paddingBottom: 20,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
});