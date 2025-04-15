import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Text,
  ActivityIndicator,
} from 'react-native';
import { AppTitle, AppBody, AppSubtitle } from '../common/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  variant: 'filled' | 'outlined';
};

type StatItem = {
  label: string;
  value: number;
};

type UserCardProps = {
  userId: string;
  name: string;
  imageUrl: string;
  role?: string;
  bio?: string;
  interests?: string[];
  stats?: StatItem[];
  variant?: 'horizontal' | 'vertical' | 'compact';
  onPress?: () => void;
  actionButton?: ActionButtonProps;
  style?: StyleProp<ViewStyle>;
};

const UserCard: React.FC<UserCardProps> = ({
  userId,
  name,
  imageUrl,
  role,
  bio,
  interests,
  stats,
  variant = 'horizontal',
  onPress,
  actionButton,
  style,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (userId) {
      navigation.navigate('Profile', { userId });
    }
  };

  const renderImage = () => {
    if (imageLoading) {
      return (
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      );
    }

    if (imageError || !imageUrl) {
      return (
        <View style={[styles.imageContainer, { backgroundColor: theme.colors.background }]}>
          <Ionicons name="person" size={24} color={theme.colors.text} />
        </View>
      );
    }

    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    );
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

  const renderInterests = () => {
    if (!interests || interests.length === 0) return null;

    return (
      <View style={styles.interestsContainer}>
        {interests.slice(0, 3).map((interest, index) => (
          <View key={index} style={styles.interestTag}>
            <AppBody style={styles.interestText}>{interest}</AppBody>
          </View>
        ))}
      </View>
    );
  };

  const renderStats = () => {
    if (!stats || stats.length === 0) return null;

    return (
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <AppBody style={styles.statValue}>{stat.value}</AppBody>
            <AppBody style={styles.statLabel}>{stat.label}</AppBody>
          </View>
        ))}
      </View>
    );
  };

  const renderVerticalCard = () => (
    <TouchableOpacity
      style={[
        styles.card,
        styles.verticalCard,
        { backgroundColor: theme.colors.card },
        style,
      ]}
      onPress={handlePress}
    >
      <View style={styles.imageWrapper}>
        {renderImage()}
      </View>
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{name}</Text>
        {role && (
          <Text style={[styles.role, { color: theme.colors.textSecondary }]}>
            {role}
          </Text>
        )}
        {bio && (
          <Text
            style={[styles.bio, { color: theme.colors.textSecondary }]}
            numberOfLines={2}
          >
            {bio}
          </Text>
        )}
        {interests && interests.length > 0 && renderInterests()}
        {actionButton && renderActionButton()}
      </View>
    </TouchableOpacity>
  );

  const renderHorizontalCard = () => (
    <TouchableOpacity
      style={[
        styles.card,
        styles.horizontalCard,
        { backgroundColor: theme.colors.card },
        style,
      ]}
      onPress={handlePress}
    >
      <View style={styles.imageWrapper}>
        {renderImage()}
      </View>
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{name}</Text>
        {role && (
          <Text style={[styles.role, { color: theme.colors.textSecondary }]}>
            {role}
          </Text>
        )}
        {bio && (
          <Text
            style={[styles.bio, { color: theme.colors.textSecondary }]}
            numberOfLines={2}
          >
            {bio}
          </Text>
        )}
        {interests && interests.length > 0 && renderInterests()}
        {actionButton && renderActionButton()}
      </View>
    </TouchableOpacity>
  );

  const renderCompactCard = () => (
    <TouchableOpacity
      style={[
        styles.card,
        styles.compactCard,
        { backgroundColor: theme.colors.card },
        style,
      ]}
      onPress={handlePress}
    >
      <View style={styles.imageWrapper}>
        {renderImage()}
      </View>
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{name}</Text>
        {role && (
          <Text style={[styles.role, { color: theme.colors.textSecondary }]}>
            {role}
          </Text>
        )}
        {actionButton && renderActionButton()}
      </View>
    </TouchableOpacity>
  );

  switch (variant) {
    case 'vertical':
      return renderVerticalCard();
    case 'compact':
      return renderCompactCard();
    case 'horizontal':
    default:
      return renderHorizontalCard();
  }
};

const styles = StyleSheet.create({
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  horizontalImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  horizontalContent: {
    flex: 1,
    marginLeft: 12,
  },
  horizontalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
    marginRight: 8,
  },
  verticalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  verticalImage: {
    width: '100%',
    height: 160,
  },
  verticalContent: {
    padding: 12,
  },
  verticalButtonContainer: {
    marginTop: 8,
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  compactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  compactContent: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    marginBottom: 2,
  },
  role: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
    marginBottom: 8,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  interestTag: {
    backgroundColor: '#f0f5ff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  interestText: {
    fontSize: 12,
    color: '#3498db',
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
});

export default UserCard; 