import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { AppTitle, AppBody, AppSubtitle } from '../../components/common/AppText';

// Mock data
const mockEvents = [
  {
    id: '1',
    title: 'Tech Meetup: ML and AI',
    date: 'Jun 15',
    time: '6:00 PM',
    location: 'Tech Hub, San Francisco',
    attendees: 42,
    imageUrl: 'https://picsum.photos/id/1/400/200',
    tags: ['Technology', 'AI'],
    price: 'Free',
  },
  {
    id: '2',
    title: 'Startup Networking Mixer',
    date: 'Jun 18',
    time: '7:00 PM',
    location: 'Coworking Space, Palo Alto',
    attendees: 78,
    imageUrl: 'https://picsum.photos/id/2/400/200',
    tags: ['Networking', 'Startups'],
    price: '$10',
  },
  {
    id: '3',
    title: 'Design Workshop',
    date: 'Jun 22',
    time: '10:00 AM',
    location: 'Design Studio, San Francisco',
    attendees: 25,
    imageUrl: 'https://picsum.photos/id/3/400/200',
    tags: ['Design', 'Workshop'],
    price: '$25',
  },
  {
    id: '4',
    title: 'Yoga in the Park',
    date: 'Jun 24',
    time: '9:00 AM',
    location: 'Golden Gate Park',
    attendees: 56,
    imageUrl: 'https://picsum.photos/id/4/400/200',
    tags: ['Wellness', 'Fitness'],
    price: '$5',
  },
  {
    id: '5',
    title: 'Photography Walk',
    date: 'Jun 25',
    time: '2:00 PM',
    location: 'Embarcadero, San Francisco',
    attendees: 18,
    imageUrl: 'https://picsum.photos/id/5/400/200',
    tags: ['Photography', 'Outdoors'],
    price: 'Free',
  },
];

const categories = [
  { id: 'all', name: 'All' },
  { id: 'tech', name: 'Technology' },
  { id: 'wellness', name: 'Wellness' },
  { id: 'business', name: 'Business' },
  { id: 'social', name: 'Social' },
  { id: 'outdoors', name: 'Outdoors' },
  { id: 'arts', name: 'Arts & Culture' },
];

type EventItemProps = {
  event: typeof mockEvents[0];
  onPress: () => void;
};

const EventCard = ({ event, onPress }: EventItemProps) => {
  return (
    <TouchableOpacity style={styles.eventCard} onPress={onPress}>
      <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
      <View style={styles.eventDetails}>
        <View style={styles.dateTimeContainer}>
          <AppBody style={styles.date}>{event.date}</AppBody>
          <AppBody style={styles.dot}>•</AppBody>
          <AppBody style={styles.time}>{event.time}</AppBody>
        </View>
        <AppBody style={styles.eventTitle}>{event.title}</AppBody>
        <AppBody style={styles.location}>{event.location}</AppBody>
        
        <View style={styles.bottomRow}>
          <AppBody style={styles.attendees}>{event.attendees} attendees</AppBody>
          <AppBody style={styles.price}>{event.price}</AppBody>
        </View>
        
        <View style={styles.tagsContainer}>
          {event.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <AppBody style={styles.tagText}>{tag}</AppBody>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

type EventsListScreenProps = {
  navigation: any;
};

const EventsListScreen: React.FC<EventsListScreenProps> = ({ navigation }) => {
  const [events, setEvents] = useState(mockEvents);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Simulate fetching events
  const fetchEvents = () => {
    setLoading(true);
    // In a real app, you would fetch events from an API
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    // In a real app, you would fetch events from an API
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text) {
      const filteredEvents = mockEvents.filter(event => 
        event.title.toLowerCase().includes(text.toLowerCase()) ||
        event.location.toLowerCase().includes(text.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(text.toLowerCase()))
      );
      setEvents(filteredEvents);
    } else {
      setEvents(mockEvents);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    if (categoryId === 'all') {
      setEvents(mockEvents);
    } else {
      const filteredEvents = mockEvents.filter(event => 
        event.tags.some(tag => tag.toLowerCase().includes(categoryId.toLowerCase()))
      );
      setEvents(filteredEvents);
    }
  };

  const navigateToEventDetails = (eventId: string) => {
    navigation.navigate('EventDetails', { eventId });
  };

  const renderEventCard = ({ item }: { item: typeof mockEvents[0] }) => (
    <EventCard 
      event={item} 
      onPress={() => navigateToEventDetails(item.id)} 
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppTitle style={styles.screenTitle}>Events</AppTitle>
        <TouchableOpacity style={styles.filterButton}>
          <AppBody style={styles.filterButtonText}>Filter</AppBody>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategory,
            ]}
            onPress={() => handleCategorySelect(category.id)}
          >
            <AppBody 
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText,
              ]}
            >
              {category.name}
            </AppBody>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.eventsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#3498db']}
            />
          }
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  screenTitle: {
    fontSize: 28,
    marginBottom: 0,
    textAlign: 'left',
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
  },
  filterButtonText: {
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  categoriesContent: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedCategory: {
    backgroundColor: '#3498db',
  },
  categoryText: {
    fontSize: 14,
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: '600',
  },
  eventsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  eventDetails: {
    padding: 15,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
  dot: {
    fontSize: 14,
    marginHorizontal: 5,
    color: '#999',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  attendees: {
    fontSize: 13,
    color: '#666',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});

export default EventsListScreen; 