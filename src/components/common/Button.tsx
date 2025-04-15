import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Button component for all primary actions
 * 
 * @example
 * // Primary button (default)
 * <Button 
 *   title="Sign In" 
 *   onPress={handleSignIn} 
 * />
 * 
 * // Secondary button with loading state
 * <Button 
 *   title="Create Event"
 *   variant="secondary"
 *   loading={isSubmitting}
 *   onPress={handleCreateEvent} 
 * />
 */
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}) => {
  // Get container style based on variant
  const getContainerStyle = () => {
    const baseStyle: ViewStyle = {
      ...styles.container,
      ...(size === 'small' ? styles.smallContainer : 
        size === 'large' ? styles.largeContainer : 
        styles.mediumContainer),
      ...(fullWidth && styles.fullWidth),
    };

    if (disabled) {
      return {
        ...baseStyle,
        ...styles.disabledContainer,
      };
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: '#3498db',
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: '#9b59b6',
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '#3498db',
        };
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  // Get text style based on variant
  const getTextStyle = () => {
    const baseStyle: TextStyle = {
      ...styles.text,
      ...(size === 'small' ? styles.smallText : 
        size === 'large' ? styles.largeText : 
        styles.mediumText),
    };

    if (disabled) {
      return {
        ...baseStyle,
        ...styles.disabledText,
      };
    }

    switch (variant) {
      case 'primary':
      case 'secondary':
        return {
          ...baseStyle,
          color: '#ffffff',
        };
      case 'outline':
      case 'text':
        return {
          ...baseStyle,
          color: '#3498db',
        };
      default:
        return baseStyle;
    }
  };

  // If loading, show activity indicator
  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'text' ? '#3498db' : '#ffffff'}
        />
      );
    }

    return (
      <View style={styles.contentContainer}>
        {icon && iconPosition === 'left' && <View style={styles.leftIcon}>{icon}</View>}
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        {icon && iconPosition === 'right' && <View style={styles.rightIcon}>{icon}</View>}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallContainer: {
    height: 32,
    paddingHorizontal: 16,
  },
  mediumContainer: {
    height: 40,
    paddingHorizontal: 24,
  },
  largeContainer: {
    height: 48,
    paddingHorizontal: 32,
  },
  fullWidth: {
    width: '100%',
  },
  disabledContainer: {
    backgroundColor: '#ced4da',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    color: '#6c757d',
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIcon: {
    marginLeft: 4,
  },
});

export default Button; 