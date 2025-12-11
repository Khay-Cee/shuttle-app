import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#278EFF',
  secondary: '#FFFFFF',
  background: '#F8F8F8',
  text: '#151515',
  textFaded: '#99A1AF',
  border: '#D1D1D6',
  disabled: '#D9D9D9',
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
