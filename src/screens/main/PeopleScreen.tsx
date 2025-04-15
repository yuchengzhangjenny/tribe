import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import UserCard from '../../components/users/UserCard';

// Define types for the navigation
type PeopleStackParamList = {
  People: undefined;
  UserDetail: { userId: string };
};

type PeopleScreenNavigationProp = StackNavigationProp<PeopleStackParamList, 'People'>;

type Props = {
  navigation: PeopleScreenNavigationProp;
};

// Mock user data for demonstration purposes
const MOCK_USERS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    role: 'Software Engineer',
    bio: 'Passionate about building great products and hiking on weekends.',
    interests: ['Hiking', 'Coding', 'Photography'],
  },
  {
    id: '2',
    name: 'Michael Chen',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    role: 'UX Designer',
    bio: 'Creating intuitive and beautiful interfaces that solve real problems.',
    interests: ['Design', 'Art', 'Travel'],
  },
  {
    id: '3',
    name: 'Alicia Rodriguez',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    role: 'Product Manager',
    bio: 'Building products that help people connect and collaborate better.',
    interests: ['Product Strategy', 'Reading', 'Yoga'],
  },
  {
    id: '4',
    name: 'James Wilson',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    role: 'Marketing Specialist',
    bio: 'Passionate about storytelling and brand building in the digital age.',
    interests: ['Marketing', 'Music', 'Travel'],
  },
  {
    id: '5',
    name: 'Zoe Taylor',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    role: 'Data Scientist',
    bio: 'Using data to uncover insights and solve complex problems.',
    interests: ['Data Analysis', 'Machine Learning', 'Running'],
  },
];

// Filter options
const FILTER_OPTIONS = ['All', 'New', 'Nearby', 'Similar Interests'];

const PeopleScreen: React.FC<Props> = ({ navigation }) => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate loading users from an API
    const loadUsers = async () => {
      setIsLoading(true);
      // In a real app, you would fetch users from an API here
      setTimeout(() => {
        setUsers(MOCK_USERS);
        setIsLoading(false);
      }, 1000);
    };

    loadUsers();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setUsers(MOCK_USERS);
      return;
    }
    
    const filtered = MOCK_USERS.filter(user => 
      user.name.toLowerCase().includes(text.toLowerCase()) ||
      user.role.toLowerCase().includes(text.toLowerCase()) ||
      user.interests.some(interest => 
        interest.toLowerCase().includes(text.toLowerCase())
      )
    );
    
    setUsers(filtered);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setIsLoading(true);
    
    // In a real app, you would apply different API filters based on the selection
    setTimeout(() => {
      // This is just a simulation for demo purposes
      let filteredUsers = [...MOCK_USERS];
      
      // Apply mock filtering logic
      switch (filter) {
        case 'New':
          // In a real app, sort by creation date
          filteredUsers = filteredUsers.slice(0, 3);
          break;
        case 'Nearby':
          // In a real app, filter by distance
          filteredUsers = filteredUsers.slice(1, 4);
          break;
        case 'Similar Interests':
          // In a real app, filter by matching interests
          filteredUsers = filteredUsers.filter(user => 
            user.interests.includes('Travel') || user.interests.includes('Photography')
          );
          break;
        default:
          // 'All' - no filtering
          break;
      }
      
      setUsers(filteredUsers);
      setIsLoading(false);
    }, 500);
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('UserDetail', { userId });
  };

  const renderItem = ({ item }: { item: typeof MOCK_USERS[0] }) => (
    <UserCard
      userId={item.id}
      name={item.name}
      imageUrl={item.imageUrl}
      role={item.role}
      bio={item.bio}
      interests={item.interests}
      onPress={() => handleUserPress(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover People</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, profession, or interests"
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={FILTER_OPTIONS}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === item && styles.selectedFilterButton,
              ]}
              onPress={() => handleFilterSelect(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === item && styles.selectedFilterText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading people...</Text>
        </View>
      ) : users.length > 0 ? (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No people found</Text>
          <Text style={styles.emptySubtext}>
            Try adjusting your search or filters
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ebebeb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    marginBottom: 10,
  },
  filtersList: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  selectedFilterButton: {
    backgroundColor: '#e1f0ff',
    borderColor: '#3498db',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  selectedFilterText: {
    color: '#3498db',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default PeopleScreen; 