// components/TypingIndicator.tsx

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '../app/constants/Styles';

const TypingIndicator = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.dot}>•</Text>
      <Text style={styles.dot}>•</Text>
      <Text style={styles.dot}>•</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    backgroundColor: COLORS.text, // System chat bubble background
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginVertical: 5,
    marginRight: 10,
    maxWidth: '80%',
  },
  dot: {
    fontSize: 20,
    color: COLORS.secondary, // White dots
    marginHorizontal: 1,
    height: 15, // Helps align the dots vertically
    lineHeight: 15,
  }
});

export default TypingIndicator;