import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SwipeableEventCard from '../../components/events/SwipeableEventCard';
import { AppBody, AppTitle } from '../../components/common/AppText';
import { getAuth } from 'firebase/auth';
import { 
  searchEvents, 
  requestToJoinEvent, 
  getEventById 
} from '../../services/eventService';
import { EventDetails, EventSearchParams } from '../../types/event';

const { width, height } = Dimensions.get('window');

const MAX_VISIBLE_CARDS = 5; // Limit to 5 events before sign-in

type EventsExploreScreenProps = {
  navigation: any;
  isLoggedIn?: boolean;
};

const EventsExploreScreen: React.FC<EventsExploreScreenProps> = ({ 
  navigation,
  isLoggedIn = false // Default to false for anonymous users
}) => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventDetails[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterVisible, setFilterVisible] = useState(false);
  const [viewedEvents, setViewedEvents] = useState<string[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMoreEvents, setNoMoreEvents] = useState(false);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch initial events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Basic search params - active events sorted by date
      const searchParams: EventSearchParams = {
        status: 'active',
        dateRange: { start: new Date() }
      };
      
      const result = await searchEvents(searchParams);
      
      if (result.events.length === 0) {
        setNoMoreEvents(true);
      } else {
        setEvents(result.events);
        setLastVisible(result.lastVisible);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load more events when we run out
  const loadMoreEvents = async () => {
    // Don't try to load more if we're already at the end
    if (noMoreEvents || loadingMore || !lastVisible) return;
    
    try {
      setLoadingMore(true);
      
      // Basic search params - active events sorted by date
      const searchParams: EventSearchParams = {
        status: 'active',
        dateRange: { start: new Date() }
      };
      
      const result = await searchEvents(searchParams, lastVisible);
      
      if (result.events.length === 0) {
        setNoMoreEvents(true);
      } else {
        setEvents(prev => [...prev, ...result.events]);
        setLastVisible(result.lastVisible);
      }
    } catch (error) {
      console.error('Error loading more events:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Check if we need to load more events
  useEffect(() => {
    // If we're getting close to the end of our events, load more
    if (events.length > 0 && currentIndex >= events.length - 2 && !noMoreEvents) {
      loadMoreEvents();
    }
  }, [currentIndex, events.length]);

  // Handle user swiping left (not interested)
  const handleSwipeLeft = (eventId: string) => {
    console.log('Skipped event:', eventId);
    setViewedEvents(prev => [...prev, eventId]);
    setCurrentIndex(prev => prev + 1);
  };

  // Handle user swiping right (interested)
  const handleSwipeRight = async (eventId: string) => {
    if (!isLoggedIn) {
      promptSignIn();
      return;
    }
    
    console.log('Interested in event:', eventId);
    setViewedEvents(prev => [...prev, eventId]);
    setCurrentIndex(prev => prev + 1);
    
    try {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Request to join the event
      const result = await requestToJoinEvent(eventId, userId);
      
      if (result.status === 'approved') {
        Alert.alert(
          'Success',
          'You have been registered for this event!',
          [
            {
              text: 'View Details',
              onPress: () => navigation.navigate('EventDetails', { eventId })
            },
            {
              text: 'Keep Exploring',
              style: 'cancel'
            }
          ]
        );
      } else {
        Alert.alert(
          'Request Submitted',
          'Your request to join this event has been submitted. The organizer will review it shortly.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error joining event:', error);
      Alert.alert('Error', 'Failed to join this event. Please try again.');
    }
  };

  // Format event for the SwipeableEventCard
  const formatEventForCard = (event: EventDetails) => {
    // Get organizer name - in a real app, you would fetch this
    // from the users collection using the organizerId
    
    return {
      id: event.id,
      title: event.basicInfo.title,
      date: new Date(event.basicInfo.dateTime).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: new Date(event.basicInfo.dateTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      location: event.basicInfo.address.split(',')[0] || '',
      address: event.basicInfo.address,
      description: event.basicInfo.description,
      imageUrl: event.basicInfo.photos && event.basicInfo.photos.length > 0 
        ? event.basicInfo.photos[0] 
        : 'https://picsum.photos/id/3/800/400',
      attendees: event.basicInfo.currentAttendees,
      maxAttendees: event.basicInfo.maxCapacity,
      price: 'Free', // You would calculate this based on your data model
      organizer: {
        userId: event.basicInfo.organizerId,
        name: 'Event Organizer', // Would fetch this from Firestore in production
        imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg', // Placeholder
        role: ''
      }
    };
  };

  // Navigate to user profile
  const handleProfilePress = (userId: string) => {
    if (!isLoggedIn) {
      promptSignIn();
      return;
    }
    
    navigation.navigate('UserProfile', { userId });
  };

  // Prompt user to sign in
  const promptSignIn = () => {
    Alert.alert(
      'Sign In Required',
      'Please sign in to continue',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Sign In',
          onPress: () => navigation.navigate('SignIn')
        }
      ]
    );
  };

  // Handle filter button press
  const handleFilterPress = () => {
    if (!isLoggedIn) {
      promptSignIn();
      return;
    }
    
    setFilterVisible(true);
  };

  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <AppBody style={styles.loadingText}>Finding events near you...</AppBody>
      </SafeAreaView>
    );
  }

  // Check if user has reached event limit and is not logged in
  const hasReachedLimit = !isLoggedIn && viewedEvents.length >= MAX_VISIBLE_CARDS;

  // Render empty state when all events are viewed
  if (events.length === 0 || currentIndex >= events.length || hasReachedLimit) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <AppTitle style={styles.title}>Explore Events</AppTitle>
        </View>
        
        <View style={styles.emptyContainer}>
          <AppTitle style={styles.emptyTitle}>
            {hasReachedLimit 
              ? 'Want to See More?' 
              : 'No More Events'}
          </AppTitle>
          <AppBody style={styles.emptyText}>
            {hasReachedLimit 
              ? 'Sign in to discover more events that match your interests.' 
              : 'Check back later for new events in your area.'}
          </AppBody>
          
          {hasReachedLimit && (
            <TouchableOpacity 
              style={styles.signInButton}
              onPress={() => navigation.navigate('SignIn')}
            >
              <AppBody style={styles.signInButtonText}>Sign In</AppBody>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Get currently visible event
  const currentEvent = events[currentIndex];
  const formattedEvent = formatEventForCard(currentEvent);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppTitle style={styles.title}>Explore Events</AppTitle>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={handleFilterPress}
        >
          <AppBody style={styles.filterButtonText}>Filter</AppBody>
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardContainer}>
        <SwipeableEventCard
          event={formattedEvent}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onProfilePress={handleProfilePress}
        />
      </View>
      
      <View style={styles.footer}>
        <AppBody style={styles.footerText}>
          {!isLoggedIn && `${viewedEvents.length}/${MAX_VISIBLE_CARDS} events viewed`}
        </AppBody>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    textAlign: 'left',
    marginBottom: 0,
  },
  filterButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cardContainer: {
    flex: 1,
  },
  footer: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  signInButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  signInButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default EventsExploreScreen; 