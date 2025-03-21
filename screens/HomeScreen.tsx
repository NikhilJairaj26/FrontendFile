import React, { useEffect, useState, useCallback } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import RecentTransferCard from '../components/RecentTransferCard';
import { getRecentTransfers } from '../services/fileService';
import { HomeScreenNavigationProp, Transfer } from '../types';
import { useUser } from '../context/UserContext';

const HomeScreen = (): React.JSX.Element => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useUser();
  
  const [transferSpeed, setTransferSpeed] = useState<string>('12.5 MB/s');
  const [recentTransfers, setRecentTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentTransfers = async () => {
      if (!user?.token) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getRecentTransfers(user.token);
        setRecentTransfers(data);
      } catch (err) {
        console.error('Error fetching recent transfers:', err);
        setError('Failed to load recent transfers.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentTransfers();
  }, [user?.token]);

  const navigateToScreen = useCallback((screenName: string) => {
    navigation.navigate(screenName as never);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#4a26fd', '#b721ff'] as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <CustomText style={styles.headerTitle}>TransferPro</CustomText>
          <TouchableOpacity style={styles.profileButton} onPress={() => navigateToScreen('Profile')}>
            <MaterialCommunityIcons name="account-circle" size={32} color="white" />
          </TouchableOpacity>
        </View>
        <CustomText style={styles.headerSubtitle}>Fast, secure file transfers</CustomText>
      </LinearGradient>

      <View style={styles.actionsContainer}>
        {[
          { icon: 'paper-plane', title: 'Send Files', color: ['#00c6ff', '#0072ff'] as [string, string], screen: 'Send' },
          { icon: 'download', title: 'Receive Files', color: ['#11998e', '#38ef7d'] as [string, string], screen: 'Receive' },
          { icon: 'folder', title: 'My Files', color: ['#f857a6', '#ff5858'] as [string, string], screen: 'MyFiles' },
        ].map((action, index) => (
          <TouchableOpacity key={index} style={styles.actionButton} onPress={() => navigateToScreen(action.screen)}>
            <LinearGradient colors={action.color} style={styles.actionGradient}>
              <FontAwesome5 name={action.icon} size={24} color="white" />
            </LinearGradient>
            <CustomText style={styles.actionText}>{action.title}</CustomText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.speedContainer}>
        <Ionicons name="speedometer-outline" size={22} color="#4a26fd" />
        <CustomText style={styles.speedText}>{`Current Transfer Speed: ${transferSpeed}`}</CustomText>
      </View>

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
          <FlatList
            data={recentTransfers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <RecentTransferCard transfer={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.transfersList}
            ListEmptyComponent={<CustomText style={styles.emptyText}>No recent transfers found.</CustomText>}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', marginTop: 5 },
  profileButton: { padding: 4 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, marginTop: -25 },
  actionButton: { alignItems: 'center', width: '30%' },
  actionGradient: { width: 65, height: 65, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  actionText: { marginTop: 8, fontSize: 14, fontWeight: '600', color: '#333' },
  speedContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(74, 38, 253, 0.1)', paddingVertical: 10, paddingHorizontal: 20, marginHorizontal: 20, borderRadius: 12 },
  speedText: { marginLeft: 8, fontSize: 14, color: '#4a26fd', fontWeight: '500' },
  recentContainer: { flex: 1, padding: 20, paddingTop: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  seeAllText: { fontSize: 14, color: '#4a26fd', fontWeight: '500' },
  transfersList: { paddingBottom: 20 },
  loadingIndicator: { marginTop: 20 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
  emptyText: { textAlign: 'center', color: '#777', marginTop: 20 },
});
