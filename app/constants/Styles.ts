// app/constants/Styles.ts

import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#278EFF', // The bright blue color
  secondary: '#FFFFFF', // White
  background: '#F8F8F8', // The light gray background
  text: '#151515', // Dark/Black text
  textFaded: '#99A1AF', // Gray text for subtle labels
  border: '#D1D1D6', // Light gray border
  disabled: '#D9D9D9', // Disabled/Grayed-out state
};

export const COMMON_STYLES = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logo: {
    width: 150, 
    height: 50, 
    resizeMode: 'contain',
  },
});