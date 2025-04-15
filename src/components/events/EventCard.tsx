import React from 'react';
import { 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  Image, 
  ViewStyle,
  StyleProp
} from 'react-native';
import { AppBody, AppTitle } from '../common/AppText';

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  variant: 'filled' | 'outlined';
};

type EventCardProps = {
  id: string;
  title: string;
  date: string;
  imageUrl?: string;
  location?: string;
  attendees?: number;
  variant?: 'horizontal' | 'vertical' | 'compact';
  onPress?: (id: string) => void;
  actionButton?: ActionButtonProps;
  style?: StyleProp<ViewStyle>;
};

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  imageUrl,
  location,
  attendees,
  variant = 'horizontal',
  onPress,
  actionButton,
  style,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(id);
    }
  };

  const renderActionButton = () => {
    if (!actionButton) return null;

    return (
      <TouchableOpacity
        style={[
          styles.actionButton,
          actionButton.variant === 'filled'
            ? styles.filledButton
            : styles.outlinedButton,
        ]}
        onPress={actionButton.onPress}
      >
        <AppBody
          style={[
            styles.actionButtonText,
            actionButton.variant === 'filled'
              ? styles.filledButtonText
              : styles.outlinedButtonText,
          ]}
        >
          {actionButton.label}
        </AppBody>
      </TouchableOpacity>
    );
  };

  const renderCompactVariant = () => (
    <TouchableOpacity 
      style={[styles.cardCompact, style]} 
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.imageCompact} />
      )}
      <View style={styles.detailsCompact}>
        <AppBody style={styles.titleCompact} numberOfLines={1}>{title}</AppBody>
        <AppBody style={styles.dateCompact}>{date}</AppBody>
      </View>
      {actionButton && renderActionButton()}
    </TouchableOpacity>
  );

  const renderVerticalVariant = () => (
    <TouchableOpacity 
      style={[styles.cardVertical, style]} 
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.imageVertical} />
      )}
      <View style={styles.detailsVertical}>
        <AppBody style={styles.titleVertical} numberOfLines={1}>{title}</AppBody>
        <AppBody style={styles.dateVertical}>{date}</AppBody>
        {location && <AppBody style={styles.locationVertical}>{location}</AppBody>}
        {actionButton && (
          <View style={styles.verticalButtonContainer}>
            {renderActionButton()}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderHorizontalVariant = () => (
    <TouchableOpacity 
      style={[styles.cardHorizontal, style]} 
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.horizontalHeader}>
        <View style={styles.detailsHorizontal}>
          <AppBody style={styles.titleHorizontal} numberOfLines={1}>{title}</AppBody>
          <AppBody style={styles.dateHorizontal}>{date}</AppBody>
          {location && <AppBody style={styles.locationHorizontal}>{location}</AppBody>}
        </View>
        {actionButton && renderActionButton()}
      </View>
    </TouchableOpacity>
  );

  switch (variant) {
    case 'compact':
      return renderCompactVariant();
    case 'vertical':
      return renderVerticalVariant();
    case 'horizontal':
    default:
      return renderHorizontalVariant();
  }
};

const styles = StyleSheet.create({
  cardCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  imageCompact: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  detailsCompact: {
    flex: 1,
    padding: 8,
  },
  titleCompact: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateCompact: {
    fontSize: 12,
    color: '#666',
  },

  cardVertical: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  imageVertical: {
    width: '100%',
    height: 120,
  },
  detailsVertical: {
    padding: 12,
  },
  titleVertical: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  dateVertical: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationVertical: {
    fontSize: 14,
    color: '#777',
  },
  verticalButtonContainer: {
    marginTop: 8,
  },

  cardHorizontal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  horizontalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailsHorizontal: {
    flex: 1,
    marginRight: 8,
  },
  titleHorizontal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateHorizontal: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationHorizontal: {
    fontSize: 14,
    color: '#777',
  },

  actionButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledButton: {
    backgroundColor: '#3498db',
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  actionButtonText: {
    fontSize: 14,
  },
  filledButtonText: {
    color: '#fff',
  },
  outlinedButtonText: {
    color: '#3498db',
  },
});

export default EventCard; 