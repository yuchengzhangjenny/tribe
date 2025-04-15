/**
 * Theme configuration for the Tribe app
 * This file contains all the styling constants used throughout the app
 */

// Colors
export const colors = {
  // Primary
  primary: '#3498db',
  primaryLight: '#5dade2',
  primaryDark: '#2980b9',
  
  // Secondary
  secondary: '#9b59b6',
  secondaryLight: '#bb8fce',
  secondaryDark: '#8e44ad',
  
  // Accent
  accent: '#e74c3c',
  accentLight: '#f1948a',
  accentDark: '#c0392b',
  
  // Greys
  grey0: '#f8f9fa',
  grey1: '#e9ecef',
  grey2: '#dee2e6',
  grey3: '#ced4da',
  grey4: '#adb5bd',
  grey5: '#6c757d',
  grey6: '#495057',
  grey7: '#343a40',
  grey8: '#212529',
  
  // UI Colors
  success: '#2ecc71',
  warning: '#f39c12',
  error: '#e74c3c',
  info: '#3498db',
  
  // Common
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  
  // Background
  background: '#f9f9f9',
  card: '#ffffff',
  
  // Text
  text: '#212529',
  textLight: '#6c757d',
  textInverse: '#ffffff',
  
  // Border
  border: '#dee2e6',
  divider: '#e9ecef',
  
  // Status
  online: '#2ecc71',
  offline: '#95a5a6',
  busy: '#e74c3c',
};

// Typography
export const typography = {
  // Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Line Heights
  lineHeight: {
    xs: 16,
    s: 20,
    m: 24,
    l: 28,
    xl: 32,
    xxl: 36,
    xxxl: 44,
  },
  
  // Font Weights
  fontWeight: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
  
  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border Radius
export const borderRadius = {
  xs: 2,
  s: 4,
  m: 8,
  l: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
};

// Shadows
export const shadows = {
  // For light mode
  light: {
    small: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    large: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  // For dark mode
  dark: {
    small: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 1,
    },
    medium: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 2,
    },
    large: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

// Layout
export const layout = {
  // Screen padding
  screenPadding: spacing.m,
  
  // Component spacing
  componentSpacing: spacing.m,
  
  // Max Width for content
  maxContentWidth: 500,
  
  // Header height
  headerHeight: 56,
  
  // Input height
  inputHeight: 48,
  
  // Button heights
  buttonHeight: {
    small: 32,
    medium: 40,
    large: 48,
  },
  
  // Bottom tab height
  bottomTabHeight: 56,
};

// Animation
export const animation = {
  // Timing
  timing: {
    quick: 150,
    default: 300,
    slow: 500,
  },
  
  // Easing
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Z-Index
export const zIndex = {
  base: 0,
  content: 1,
  navigation: 10,
  modal: 100,
  toast: 1000,
};

// Export the theme as a single object
const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
  animation,
  zIndex,
};

export default theme; 