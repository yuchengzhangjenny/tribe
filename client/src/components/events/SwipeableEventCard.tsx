import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleProp,
  ViewStyle
} from 'react-native';
import { AppBody, AppTitle, AppSubtitle } from '../common/AppText';
import UserCard from '../users/UserCard';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = height * 0.6;
const SWIPE_THRESHOLD = width * 0.25;

type Organizer = {
  userId: string;
  name: string;
  imageUrl: string;
  role?: string;
};

export type EventCardData = {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  address?: string;
  description?: string;
  imageUrl: string;
  attendees?: number;
  maxAttendees?: number;
  price?: string;
  organizer: Organizer;
};

type SwipeableEventCardProps = {
  event: EventCardData;
  onSwipeLeft?: (eventId: string) => void;
  onSwipeRight?: (eventId: string) => void;
  onProfilePress?: (userId: string) => void;
  style?: StyleProp<ViewStyle>;
};

const SwipeableEventCard: React.FC<SwipeableEventCardProps> = ({
  event,
  onSwipeLeft,
  onSwipeRight,
  onProfilePress,
  style
}) => {
  const [expanded, setExpanded] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const scrollPosition = useRef(new Animated.Value(0)).current;
  const expandAnimation = useRef(new Animated.Value(0)).current;

  // Configure pan responder for horizontal swipes
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !expanded,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only handle horizontal swipes when not expanded
        return !expanded && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!expanded) {
          position.setValue({ x: gestureState.dx, y: 0 });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (expanded) return;

        if (gestureState.dx > SWIPE_THRESHOLD) {
          swipeRight();
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  // Configure scroll handling for expansion
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollPosition } } }],
    { useNativeDriver: false }
  );

  // Animation to expand the card
  const expandCard = () => {
    setExpanded(true);
    Animated.timing(expandAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Animation to collapse the card
  const collapseCard = () => {
    Animated.timing(expandAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setExpanded(false);
    });
  };

  // Swipe card to the right (interested)
  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: width + 100, y: 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onSwipeRight) onSwipeRight(event.id);
    });
  };

  // Swipe card to the left (not interested)
  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -width - 100, y: 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onSwipeLeft) onSwipeLeft(event.id);
    });
  };

  // Reset card position
  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  // Calculate rotation based on position
  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-width * 1.5, 0, width * 1.5],
      outputRange: ['-30deg', '0deg', '30deg'],
      extrapolate: 'clamp',
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  // Calculate height based on expanded state
  const animatedHeight = expandAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [CARD_HEIGHT, height * 0.85],
  });

  const animatedBorderRadius = expandAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 0],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.card,
          getCardStyle(),
          {
            height: animatedHeight,
            borderRadius: animatedBorderRadius,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScrollEndDrag={(e) => {
            if (e.nativeEvent.contentOffset.y > 50 && !expanded) {
              expandCard();
            } else if (e.nativeEvent.contentOffset.y < 10 && expanded) {
              collapseCard();
            }
          }}
        >
          {/* Top portion always visible */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: event.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.topOverlay}>
              <AppTitle style={styles.title}>{event.title}</AppTitle>
              <AppBody style={styles.date}>{event.date}</AppBody>
            </View>
          </View>

          {/* Details section */}
          <View style={styles.detailsContainer}>
            <View style={styles.basicDetails}>
              <View style={styles.detailItem}>
                <AppSubtitle style={styles.detailLabel}>Location</AppSubtitle>
                <AppBody style={styles.detailText}>{event.location}</AppBody>
              </View>
              
              {event.time && (
                <View style={styles.detailItem}>
                  <AppSubtitle style={styles.detailLabel}>Time</AppSubtitle>
                  <AppBody style={styles.detailText}>{event.time}</AppBody>
                </View>
              )}

              {event.attendees !== undefined && event.maxAttendees !== undefined && (
                <View style={styles.detailItem}>
                  <AppSubtitle style={styles.detailLabel}>Attendees</AppSubtitle>
                  <AppBody style={styles.detailText}>
                    {event.attendees}/{event.maxAttendees}
                  </AppBody>
                </View>
              )}

              {event.price && (
                <View style={styles.detailItem}>
                  <AppSubtitle style={styles.detailLabel}>Price</AppSubtitle>
                  <AppBody style={styles.detailText}>{event.price}</AppBody>
                </View>
              )}
            </View>

            {/* Expandable content - only visible when card is expanded */}
            <Animated.View
              style={[
                styles.expandableContent,
                {
                  opacity: expandAnimation,
                },
              ]}
            >
              {event.description && (
                <View style={styles.section}>
                  <AppSubtitle style={styles.sectionTitle}>About</AppSubtitle>
                  <AppBody style={styles.description}>{event.description}</AppBody>
                </View>
              )}

              {event.address && (
                <View style={styles.section}>
                  <AppSubtitle style={styles.sectionTitle}>Address</AppSubtitle>
                  <AppBody style={styles.description}>{event.address}</AppBody>
                </View>
              )}

              <View style={styles.section}>
                <AppSubtitle style={styles.sectionTitle}>Organizer</AppSubtitle>
                <UserCard
                  userId={event.organizer.userId}
                  name={event.organizer.name}
                  imageUrl={event.organizer.imageUrl}
                  role={event.organizer.role}
                  variant="horizontal"
                  onPress={() => onProfilePress && onProfilePress(event.organizer.userId)}
                />
              </View>

              <View style={styles.swipeInstructions}>
                <AppBody style={styles.swipeInstructionsText}>
                  Scroll up and swipe left to skip or right to join
                </AppBody>
              </View>
            </Animated.View>
          </View>
        </ScrollView>

        {/* Swipe indicators - only visible in card mode */}
        {!expanded && (
          <>
            <Animated.View
              style={[
                styles.swipeIndicatorLeft,
                {
                  opacity: position.x.interpolate({
                    inputRange: [-SWIPE_THRESHOLD, 0],
                    outputRange: [1, 0],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            >
              <AppBody style={styles.swipeIndicatorText}>SKIP</AppBody>
            </Animated.View>
            <Animated.View
              style={[
                styles.swipeIndicatorRight,
                {
                  opacity: position.x.interpolate({
                    inputRange: [0, SWIPE_THRESHOLD],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            >
              <AppBody style={styles.swipeIndicatorText}>JOIN</AppBody>
            </Animated.View>
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    height: CARD_HEIGHT * 0.6,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
  },
  title: {
    color: 'white',
    fontSize: 22,
    textAlign: 'left',
    marginBottom: 5,
  },
  date: {
    color: 'white',
    fontSize: 16,
  },
  detailsContainer: {
    padding: 15,
  },
  basicDetails: {
    marginBottom: 15,
  },
  detailItem: {
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
    marginBottom: 2,
  },
  detailText: {
    fontSize: 16,
  },
  expandableContent: {
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 10,
  },
  description: {
    lineHeight: 22,
  },
  swipeIndicatorLeft: {
    position: 'absolute',
    top: 30,
    left: 30,
    padding: 10,
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    borderRadius: 5,
    transform: [{ rotate: '-30deg' }],
  },
  swipeIndicatorRight: {
    position: 'absolute',
    top: 30,
    right: 30,
    padding: 10,
    backgroundColor: 'rgba(46, 204, 113, 0.8)',
    borderRadius: 5,
    transform: [{ rotate: '30deg' }],
  },
  swipeIndicatorText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  swipeInstructions: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  swipeInstructionsText: {
    color: '#666',
    fontSize: 14,
  },
});

export default SwipeableEventCard; 