import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { AppTitle, AppBody } from '../../components/common/AppText';
import UserCard from '../../components/users/UserCard';
import EventCard from '../../components/events/EventCard';

// Mock user data
const userProfileData = {
  userId: '1',
  name: 'Sarah Johnson',
  imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
  role: 'Product Designer',
  bio: 'Passionate designer creating user-centered experiences. Love traveling, photography, and good coffee.',
  location: 'San Francisco, CA',
  interests: ['Design', 'Photography', 'Travel', 'Coffee', 'Technology'],
  stats: [
    { label: 'Events', value: 24 },
    { label: 'Connections', value: 186 },
    { label: 'Groups', value: 8 },
  ],
};

// Mock connections data
const connectionsData = [
  {
    userId: '2',
    name: 'Michael Chen',
    imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    role: 'Software Engineer',
  },
  {
    userId: '3',
    name: 'Jessica Williams',
    imageUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
    role: 'Marketing Manager',
  },
  {
    userId: '4',
    name: 'David Brown',
    imageUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
    role: 'UI/UX Designer',
  },
  {
    userId: '5',
    name: 'Emily Davis',
    imageUrl: 'https://randomuser.me/api/portraits/women/5.jpg',
    role: 'Product Manager',
  },
];

// Mock events data
const userEventsData = [
  {
    id: '1',
    title: 'Design Workshop',
    date: 'Jun 22',
    imageUrl: 'https://picsum.photos/id/3/400/200',
  },
  {
    id: '2',
    title: 'Tech Meetup',
    date: 'Jul 5',
    imageUrl: 'https://picsum.photos/id/1/400/200',
  },
];

type Props = {
  navigation: any;
  route: {
    params?: {
      userId?: string;
    };
  };
};

const UserProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const [isConnected, setIsConnected] = useState(false);
  // For a real app, you'd fetch the user data based on route.params.userId
  const userData = userProfileData;

  const handleConnect = () => {
    // In a real app, this would make an API call to connect with the user
    setIsConnected(!isConnected);
  };

  const handleMessage = () => {
    // Navigate to messaging screen
    // navigation.navigate('ChatScreen', { userId: userData.userId });
    console.log('Navigate to chat with user:', userData.userId);
  };

  const navigateToUserProfile = (userId: string) => {
    // In a real app with a nested stack, you'd use something like:
    // navigation.push('UserProfile', { userId });
    console.log('Navigate to user profile:', userId);
  };

  const navigateToEvent = (eventId: string) => {
    navigation.navigate('EventDetails', { eventId });
  };

  const renderConnectionItem = ({ item }: { item: typeof connectionsData[0] }) => (
    <UserCard
      userId={item.userId}
      name={item.name}
      imageUrl={item.imageUrl}
      role={item.role}
      variant="compact"
      onPress={() => navigateToUserProfile(item.userId)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <AppBody style={styles.backButtonText}>←</AppBody>
          </TouchableOpacity>
          <AppTitle style={styles.headerTitle}>Profile</AppTitle>
          <View style={styles.placeholderRight} />
        </View>

        <View style={styles.profileSection}>
          <UserCard
            userId={userData.userId}
            name={userData.name}
            imageUrl={userData.imageUrl}
            role={userData.role}
            bio={userData.bio}
            interests={userData.interests}
            stats={userData.stats}
            variant="vertical"
            actionButton={
              isConnected
                ? {
                    label: 'Message',
                    onPress: handleMessage,
                    variant: 'filled',
                  }
                : {
                    label: 'Connect',
                    onPress: handleConnect,
                    variant: 'filled',
                  }
            }
          />
        </View>

        <View style={styles.connectionsSection}>
          <View style={styles.sectionHeader}>
            <AppTitle style={styles.sectionTitle}>Connections</AppTitle>
            <TouchableOpacity>
              <AppBody style={styles.seeAllButton}>See All</AppBody>
            </TouchableOpacity>
          </View>
          <FlatList
            data={connectionsData}
            renderItem={renderConnectionItem}
            keyExtractor={(item) => item.userId}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.connectionsList}
          />
        </View>

        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <AppTitle style={styles.sectionTitle}>Upcoming Events</AppTitle>
            <TouchableOpacity>
              <AppBody style={styles.seeAllButton}>See All</AppBody>
            </TouchableOpacity>
          </View>
          {userEventsData.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              date={event.date}
              imageUrl={event.imageUrl}
              variant="horizontal"
              onPress={navigateToEvent}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 0,
  },
  placeholderRight: {
    width: 40,
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  connectionsSection: {
    paddingTop: 20,
    paddingBottom: 10,
    borderTopWidth: 8,
    borderTopColor: '#f5f5f5',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 0,
  },
  seeAllButton: {
    fontSize: 14,
    color: '#3498db',
  },
  connectionsList: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  eventsSection: {
    paddingTop: 20,
    paddingBottom: 30,
    borderTopWidth: 8,
    borderTopColor: '#f5f5f5',
  },
  eventItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
});

export default UserProfileScreen; 