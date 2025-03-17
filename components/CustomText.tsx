import React from 'react';
import { Text, StyleSheet, TextProps, TextStyle } from 'react-native';

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  style?: TextStyle | (TextStyle | false | null | undefined)[]; // Allow single or array of styles, including false/null
}

export default function CustomText({ children, style, ...props }: CustomTextProps) {
  // Resolve styles: filter out false, null, or undefined values
  const resolvedStyle = Array.isArray(style)
    ? style.filter((s) => s) // Remove falsy values
    : style || {}; // Fallback to an empty object if style is falsy

  return (
    <Text style={[styles.text, resolvedStyle]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16, // Default font size
    color: '#333', // Default text color
    fontFamily: 'System', // Default font family (adjust as needed)
  },
});