import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { AppTitle, AppBody } from '../../components/common/AppText';
import UserCard from '../../components/users/UserCard';

// Mock users data
const mockUsers = [
  {
    userId: '1',
    name: 'Sarah Johnson',
    imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    role: 'Product Designer',
    bio: 'Passionate designer creating user-centered experiences',
    interests: ['Design', 'Photography', 'Technology'],
  },
  {
    userId: '2',
    name: 'Michael Chen',
    imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    role: 'Software Engineer',
    bio: 'Full-stack developer with a focus on React Native and Node.js',
    interests: ['Coding', 'Music', 'Hiking'],
  },
  {
    userId: '3',
    name: 'Jessica Williams',
    imageUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
    role: 'Marketing Manager',
    bio: 'Building brands and creating engaging social media campaigns',
    interests: ['Marketing', 'Social Media', 'Writing'],
  },
  {
    userId: '4',
    name: 'David Brown',
    imageUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
    role: 'UI/UX Designer',
    bio: 'Creating beautiful and functional user interfaces',
    interests: ['UI/UX', 'Art', 'Typography'],
  },
  {
    userId: '5',
    name: 'Emily Davis',
    imageUrl: 'https://randomuser.me/api/portraits/women/5.jpg',
    role: 'Product Manager',
    bio: 'Guiding products from conception to launch',
    interests: ['Project Management', 'Strategy', 'Tech'],
  },
  {
    userId: '6',
    name: 'Alex Turner',
    imageUrl: 'https://randomuser.me/api/portraits/men/6.jpg',
    role: 'Data Scientist',
    bio: 'Analyzing data to solve complex problems',
    interests: ['Data', 'Machine Learning', 'Science'],
  },
  {
    userId: '7',
    name: 'Olivia Martinez',
    imageUrl: 'https://randomuser.me/api/portraits/women/7.jpg',
    role: 'Content Creator',
    bio: 'Crafting compelling stories and engaging content',
    interests: ['Writing', 'Photography', 'Social Media'],
  },
];

type UsersSearchScreenProps = {
  navigation: any;
};

const UsersSearchScreen: React.FC<UsersSearchScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(false);

  // Simulate fetching user data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter users when search query changes
  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = users.filter(
        user =>
          user.name.toLowerCase().includes(lowercasedQuery) ||
          user.role.toLowerCase().includes(lowercasedQuery) ||
          user.interests.some(interest => interest.toLowerCase().includes(lowercasedQuery))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const navigateToUserProfile = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  const handleConnectUser = (userId: string) => {
    // In a real app, you would make an API call to connect with the user
    console.log('Connect with user:', userId);
    // Show some feedback to the user that the connection request was sent
  };

  const renderUserItem = ({ item }: { item: typeof mockUsers[0] }) => (
    <UserCard
      userId={item.userId}
      name={item.name}
      imageUrl={item.imageUrl}
      role={item.role}
      bio={item.bio}
      variant="horizontal"
      onPress={() => navigateToUserProfile(item.userId)}
      actionButton={{
        label: 'Connect',
        onPress: () => handleConnectUser(item.userId),
        variant: 'outlined',
      }}
      style={styles.userCard}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppTitle style={styles.title}>Find People</AppTitle>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, role, or interests..."
          value={searchQuery}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.userId}
          contentContainerStyle={styles.usersList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <AppBody style={styles.emptyText}>No users found</AppBody>
            </View>
          }
        />
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
    paddingTop: 15,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 0,
    textAlign: 'left',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  usersList: {
    padding: 15,
  },
  userCard: {
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});

export default UsersSearchScreen; 