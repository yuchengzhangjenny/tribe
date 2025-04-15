import React from 'react';
import { Text, StyleSheet, TextStyle, TextProps, Platform } from 'react-native';

// Base Text component with shared properties
interface BaseTextProps extends TextProps {
  style?: TextStyle | object;
  children: React.ReactNode;
}

const AppText = ({ style, children, ...props }: BaseTextProps) => (
  <Text style={[styles.base, style]} {...props}>
    {children}
  </Text>
);

// Title text (large, bold headings)
const AppTitle = ({ style, children, ...props }: BaseTextProps) => (
  <Text style={[styles.base, styles.title, style]} {...props}>
    {children}
  </Text>
);

// Subtitle text (smaller headings, used for descriptions)
const AppSubtitle = ({ style, children, ...props }: BaseTextProps) => (
  <Text style={[styles.base, styles.subtitle, style]} {...props}>
    {children}
  </Text>
);

// Body text (regular text used for content)
const AppBody = ({ style, children, ...props }: BaseTextProps) => (
  <Text style={[styles.base, styles.body, style]} {...props}>
    {children}
  </Text>
);

// Option text (text used for selectable options)
const AppOptionText = ({ style, children, ...props }: BaseTextProps) => (
  <Text style={[styles.base, styles.option, style]} {...props}>
    {children}
  </Text>
);

// Error text (text used for error messages)
const AppErrorText = ({ style, children, ...props }: BaseTextProps) => (
  <Text style={[styles.base, styles.error, style]} {...props}>
    {children}
  </Text>
);

// Link text (text that looks like a clickable link)
const AppLinkText = ({ style, children, ...props }: BaseTextProps) => (
  <Text style={[styles.base, styles.link, style]} {...props}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  base: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  option: {
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    fontSize: 14,
    color: '#e74c3c',
    marginTop: 5,
  },
  link: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '500',
  },
});

export {
  AppText,
  AppTitle,
  AppSubtitle,
  AppBody,
  AppOptionText,
  AppErrorText,
  AppLinkText,
}; 