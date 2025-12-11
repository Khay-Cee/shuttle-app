// components/SelectionCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Styles';

interface CardProps {
  primaryText: string;
  secondaryText: string;
  isSelected: boolean;
  isDisabled: boolean;
  onPress: () => void;
}

const SelectionCard: React.FC<CardProps> = ({
  primaryText,
  secondaryText,
  isSelected,
  isDisabled,
  onPress
}) => {

  const cardStyle = [
    styles.card,
    isSelected === true && styles.selectedCard,
    isDisabled && styles.disabledCard,
  ];

  const primaryStyle = [
    styles.primaryText,
    isSelected === true && styles.selectedPrimaryText,
    isDisabled && styles.disabledText
  ];

  const secondaryStyle = [
    styles.secondaryText,
    isSelected === true && styles.selectedSecondaryText,
    isDisabled && styles.disabledText
  ];

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={isDisabled ? undefined : onPress}
      activeOpacity={isDisabled ? 1 : 0.6}
    >
      <View style={styles.textContainer}>
        <Text style={primaryStyle}>{primaryText}</Text>
        <Text style={secondaryStyle}>{secondaryText}</Text>
      </View>

      {isSelected && !isDisabled && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.secondary,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: '#EEF6FF', // light tint so selection is obvious
  },

  disabledCard: {
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.disabled,
  },

  textContainer: {
    flex: 1,
  },

  primaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  secondaryText: {
    fontSize: 14,
    color: COLORS.textFaded,
  },

  selectedPrimaryText: {
    color: COLORS.primary,
  },

  selectedSecondaryText: {
    color: COLORS.primary,
  },

  disabledText: {
    color: '#999',
  },

  checkmark: {
    marginLeft: 10,
  }
});

export default SelectionCard;
