import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  Share,
  Alert,
} from 'react-native';
import { 
  AppTitle, 
  AppBody, 
  AppSubtitle 
} from '../../components/common/AppText';
import UserCard from '../../components/users/UserCard';

// Mock data - in a real app this would come from an API or props
const eventData = {
  id: '1',
  title: 'Design Workshop',
  date: 'Jun 22, 2023',
  time: '6:00 PM - 9:00 PM',
  location: 'San Francisco Design Center',
  address: '101 Henry Adams St, San Francisco, CA 94103',
  description:
    'Join us for a hands-on workshop on designing better user experiences. Learn from industry experts and network with fellow designers. We\'ll cover the latest trends in UI/UX design, interactive prototyping, and user research methodologies.',
  imageUrl: 'https://picsum.photos/id/3/800/400',
  attendees: 24,
  maxAttendees: 50,
  price: 'Free',
  organizer: {
    userId: '2',
    name: 'Michael Chen',
    imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    role: 'UX Design Lead',
  },
};

// Mock attendees data
const attendeesData = [
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

type Props = {
  navigation: any;
  route: {
    params?: {
      eventId?: string;
    };
  };
};

const EventDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  
  // In a real app, you would fetch the event data using the route.params.eventId
  // const { eventId } = route.params;
  const event = eventData;

  const handleRegister = () => {
    // In a real app, this would make an API call to register for the event
    setIsRegistered(true);
    Alert.alert(
      'Success',
      'You have successfully registered for this event!',
      [{ text: 'OK' }]
    );
  };

  const handleUnregister = () => {
    // In a real app, this would make an API call to unregister
    Alert.alert(
      'Unregister',
      'Are you sure you want to cancel your registration?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => setIsRegistered(false),
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this event: ${event.title}. It's on ${event.date} at ${event.location}`,
        title: event.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const navigateToUserProfile = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  const renderAttendeeItem = ({ item }: { item: typeof attendeesData[0] }) => (
    <UserCard
      userId={item.userId}
      name={item.name}
      imageUrl={item.imageUrl}
      role={item.role}
      variant="compact"
      onPress={() => navigateToUserProfile(item.userId)}
      style={styles.attendeeCard}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <AppBody style={styles.backButtonText}>←</AppBody>
          </TouchableOpacity>
          <AppTitle style={styles.headerTitle}>Event Details</AppTitle>
          <View style={styles.placeholderRight} />
        </View>

        <Image source={{ uri: event.imageUrl }} style={styles.coverImage} />
        
        <View style={styles.content}>
          <AppTitle style={styles.title}>{event.title}</AppTitle>
          
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <AppSubtitle style={styles.detailLabel}>Date</AppSubtitle>
              <AppBody>{event.date}</AppBody>
            </View>
            <View style={styles.detailItem}>
              <AppSubtitle style={styles.detailLabel}>Time</AppSubtitle>
              <AppBody>{event.time}</AppBody>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <AppSubtitle style={styles.detailLabel}>Location</AppSubtitle>
            <AppBody>{event.location}</AppBody>
          </View>
          
          <View style={styles.detailItem}>
            <AppSubtitle style={styles.detailLabel}>Address</AppSubtitle>
            <AppBody>{event.address}</AppBody>
          </View>
          
          <View style={styles.section}>
            <AppSubtitle style={styles.sectionTitle}>About</AppSubtitle>
            <AppBody>{event.description}</AppBody>
          </View>
          
          <View style={styles.section}>
            <AppSubtitle style={styles.sectionTitle}>Organizer</AppSubtitle>
            <UserCard
              userId={event.organizer.userId}
              name={event.organizer.name}
              imageUrl={event.organizer.imageUrl}
              role={event.organizer.role}
              variant="horizontal"
              onPress={() => navigateToUserProfile(event.organizer.userId)}
            />
          </View>
          
          <View style={styles.section}>
            <AppSubtitle style={styles.sectionTitle}>Attendees</AppSubtitle>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.attendeesList}
            >
              {attendeesData.map((attendee) => (
                <UserCard
                  key={attendee.userId}
                  userId={attendee.userId}
                  name={attendee.name}
                  imageUrl={attendee.imageUrl}
                  role={attendee.role}
                  variant="compact"
                  onPress={() => navigateToUserProfile(attendee.userId)}
                  style={styles.attendeeCard}
                />
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.section}>
            <AppSubtitle style={styles.sectionTitle}>Attendees ({event.attendees}/{event.maxAttendees})</AppSubtitle>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <AppSubtitle style={styles.priceLabel}>Price</AppSubtitle>
          <AppBody style={styles.price}>{event.price}</AppBody>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <AppBody style={styles.shareButtonText}>Share</AppBody>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.registerButton,
              isRegistered ? styles.unregisterButton : styles.registerButtonActive,
            ]}
            onPress={isRegistered ? handleUnregister : handleRegister}
          >
            <AppBody
              style={[
                styles.registerButtonText,
                isRegistered ? styles.unregisterButtonText : styles.registerButtonTextActive,
              ]}
            >
              {isRegistered ? 'Cancel Registration' : 'Register for Event'}
            </AppBody>
          </TouchableOpacity>
        </View>
      </View>
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
  coverImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Extra padding to ensure content is visible above footer
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'left',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailItem: {
    flex: 1,
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'left',
  },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'left',
    color: '#333',
  },
  attendeesList: {
    paddingVertical: 10,
  },
  attendeeCard: {
    marginRight: 10,
    maxWidth: 120,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    textAlign: 'left',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  shareButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  shareButtonText: {
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonActive: {
    backgroundColor: '#3498db',
  },
  unregisterButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButtonTextActive: {
    color: '#fff',
  },
  unregisterButtonText: {
    color: '#e74c3c',
  },
});

export default EventDetailsScreen; 