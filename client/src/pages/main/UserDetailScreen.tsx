import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define types for the navigation
type PeopleStackParamList = {
  People: undefined;
  UserDetail: { userId: string };
  Chat?: { userId: string; userName: string };
};

type UserDetailScreenRouteProp = RouteProp<PeopleStackParamList, 'UserDetail'>;
type UserDetailScreenNavigationProp = StackNavigationProp<PeopleStackParamList>;

type Props = {
  route: UserDetailScreenRouteProp;
  navigation: UserDetailScreenNavigationProp;
};

// Mock user data (in a real app, this would come from a service)
const MOCK_USER_DETAILS = {
  '1': {
    id: '1',
    name: 'Sarah Johnson',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    coverImageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071',
    age: 29,
    location: 'San Francisco, CA',
    role: 'Software Engineer',
    company: 'Tech Innovations Inc.',
    bio: 'Passionate about building great products and hiking on weekends. I love to travel and explore new cultures. Always up for a good conversation over coffee.',
    interests: ['Hiking', 'Coding', 'Photography', 'Travel', 'Coffee', 'Reading'],
    education: 'Stanford University',
    connectionStatus: 'connect', // 'connect', 'pending', 'connected'
    mutualConnections: 3,
    socialLinks: {
      linkedin: 'sarah-johnson',
      twitter: '@sarahjdev',
      instagram: '@sarahjphoto',
    },
  },
  '2': {
    id: '2',
    name: 'Michael Chen',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    coverImageUrl: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e',
    age: 32,
    location: 'New York, NY',
    role: 'UX Designer',
    company: 'CreativeTech Co.',
    bio: 'Creating intuitive and beautiful interfaces that solve real problems. Passionate about design thinking and user-centered approaches.',
    interests: ['Design', 'Art', 'Travel', 'Photography', 'Music', 'Food'],
    education: 'Rhode Island School of Design',
    connectionStatus: 'pending',
    mutualConnections: 5,
    socialLinks: {
      linkedin: 'michael-chen-ux',
      twitter: '@michelchendesign',
      instagram: '@mchendesigns',
    },
  },
  '3': {
    id: '3',
    name: 'Alicia Rodriguez',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    coverImageUrl: 'https://images.unsplash.com/photo-1459213599465-03ab6a4d5931',
    age: 31,
    location: 'Austin, TX',
    role: 'Product Manager',
    company: 'Future Products Inc.',
    bio: 'Building products that help people connect and collaborate better. Interested in sustainable innovation and community building.',
    interests: ['Product Strategy', 'Reading', 'Yoga', 'Cycling', 'Cooking', 'Gardening'],
    education: 'University of Texas',
    connectionStatus: 'connected',
    mutualConnections: 7,
    socialLinks: {
      linkedin: 'alicia-rodriguez',
      twitter: '@alicia_product',
      instagram: '@alicia.rodriguez',
    },
  },
};

const UserDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { userId } = route.params;
  const [user, setUser] = useState<null | typeof MOCK_USER_DETAILS[keyof typeof MOCK_USER_DETAILS]>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connect' | 'pending' | 'connected'>('connect');
  
  useEffect(() => {
    // Simulate fetching user details from API
    const loadUserDetails = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch user details from an API here
        setTimeout(() => {
          const userDetails = MOCK_USER_DETAILS[userId as keyof typeof MOCK_USER_DETAILS];
          
          if (userDetails) {
            setUser(userDetails);
            setConnectionStatus(userDetails.connectionStatus as 'connect' | 'pending' | 'connected');
          }
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading user details:', error);
        setLoading(false);
      }
    };
    
    loadUserDetails();
  }, [userId]);

  const handleConnect = () => {
    if (connectionStatus === 'connect') {
      setConnectionStatus('pending');
      // In a real app, you would make an API call to send connection request
    }
  };

  const handleMessage = () => {
    if (user) {
      // In a real app, navigate to chat screen with this user
      navigation.navigate('Chat', { userId: user.id, userName: user.name });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#e74c3c" />
        <Text style={styles.errorText}>User not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <View style={styles.coverImageContainer}>
          <Image source={{ uri: user.coverImageUrl }} style={styles.coverImage} />
          <TouchableOpacity 
            style={styles.backIconButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.role}>{user.role} at {user.company}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.locationText}>{user.location}</Text>
            </View>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.connectButton, 
              connectionStatus === 'pending' && styles.pendingButton,
              connectionStatus === 'connected' && styles.connectedButton,
            ]} 
            onPress={handleConnect}
            disabled={connectionStatus !== 'connect'}
          >
            <Text style={styles.connectButtonText}>
              {connectionStatus === 'connect' && 'Connect'}
              {connectionStatus === 'pending' && 'Pending'}
              {connectionStatus === 'connected' && 'Connected'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.messageButton} 
            onPress={handleMessage}
          >
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
        
        {/* Mutual Connections */}
        {user.mutualConnections > 0 && (
          <View style={styles.mutualConnectionsContainer}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.mutualConnectionsText}>
              {user.mutualConnections} mutual connection{user.mutualConnections !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
        
        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>
        
        {/* Education Section */}
        {user.education && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.educationContainer}>
              <Ionicons name="school-outline" size={18} color="#666" />
              <Text style={styles.educationText}>{user.education}</Text>
            </View>
          </View>
        )}
        
        {/* Interests Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestsContainer}>
            {user.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Social Links */}
        {user.socialLinks && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Social</Text>
            <View style={styles.socialLinksContainer}>
              {user.socialLinks.linkedin && (
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-linkedin" size={20} color="#0077B5" />
                  <Text style={styles.socialButtonText}>{user.socialLinks.linkedin}</Text>
                </TouchableOpacity>
              )}
              
              {user.socialLinks.twitter && (
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
                  <Text style={styles.socialButtonText}>{user.socialLinks.twitter}</Text>
                </TouchableOpacity>
              )}
              
              {user.socialLinks.instagram && (
                <TouchableOpacity style={styles.socialButton}>
                  <Ionicons name="logo-instagram" size={20} color="#E1306C" />
                  <Text style={styles.socialButtonText}>{user.socialLinks.instagram}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  coverImageContainer: {
    position: 'relative',
    height: 180,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  backIconButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
    marginTop: -40,
  },
  nameContainer: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginTop: 3,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  connectButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  pendingButton: {
    backgroundColor: '#f39c12',
  },
  connectedButton: {
    backgroundColor: '#27ae60',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  messageButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
    alignItems: 'center',
  },
  messageButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  mutualConnectionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mutualConnectionsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  educationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  educationText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 8,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: '#333',
    fontSize: 14,
  },
  socialLinksContainer: {
    marginTop: 5,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 10,
  },
  bottomSpacing: {
    height: 30,
  },
});

export default UserDetailScreen; 