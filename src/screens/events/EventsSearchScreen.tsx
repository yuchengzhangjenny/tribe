import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { AppTitle, AppBody } from '../../components/common/AppText';
import EventCard from '../../components/events/EventCard';

// Mock events data
const mockEvents = [
  {
    id: '1',
    title: 'Design Workshop',
    date: 'Jun 22',
    location: 'San Francisco',
    imageUrl: 'https://picsum.photos/id/3/400/200',
    attendees: 24,
  },
  {
    id: '2',
    title: 'Tech Meetup',
    date: 'Jul 5',
    location: 'New York',
    imageUrl: 'https://picsum.photos/id/1/400/200',
    attendees: 42,
  },
  {
    id: '3',
    title: 'Product Conference',
    date: 'Jul 12',
    location: 'Chicago',
    imageUrl: 'https://picsum.photos/id/20/400/200',
    attendees: 120,
  },
  {
    id: '4',
    title: 'Startup Weekend',
    date: 'Aug 3',
    location: 'Seattle',
    imageUrl: 'https://picsum.photos/id/25/400/200',
    attendees: 87,
  },
  {
    id: '5',
    title: 'Networking Event',
    date: 'Aug 15',
    location: 'Los Angeles',
    imageUrl: 'https://picsum.photos/id/65/400/200',
    attendees: 56,
  },
];

type EventsSearchScreenProps = {
  navigation: any;
};

const EventsSearchScreen: React.FC<EventsSearchScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState(mockEvents);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Filter events based on search query
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const navigateToEventDetails = (eventId: string) => {
    navigation.navigate('EventDetails', { eventId });
  };

  const registerForEvent = (eventId: string) => {
    // In a real app, this would make an API call to register for the event
    console.log('Registering for event:', eventId);
    // Show some feedback to the user that they've registered
  };

  const renderEventItem = ({ item }: { item: typeof mockEvents[0] }) => (
    <EventCard
      id={item.id}
      title={item.title}
      date={item.date}
      location={item.location}
      imageUrl={item.imageUrl}
      attendees={item.attendees}
      variant="vertical"
      onPress={navigateToEventDetails}
      actionButton={{
        label: 'Register',
        onPress: () => registerForEvent(item.id),
        variant: 'outlined',
      }}
      style={styles.eventCard}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppTitle style={styles.title}>Upcoming Events</AppTitle>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title or location..."
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
          data={filteredEvents}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.eventsList}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <AppBody style={styles.emptyText}>No events found</AppBody>
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
  listContainer: {
    paddingVertical: 15,
  },
  eventsList: {
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  eventCard: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 15,
    width: '48%',
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

export default EventsSearchScreen; 