// components/SelectionCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../app/constants/Styles';

interface CardProps {
  primaryText: string;
  secondaryText: string;
  isSelected: boolean;
  isDisabled: boolean; // For shuttles already picked
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
    isSelected && styles.selectedCard, // Blue border when selected
    isDisabled && styles.disabledCard, // Gray border when disabled
  ];

  const textStyle = [
    styles.primaryText,
    isSelected && styles.selectedText, // Blue text when selected
  ];

  const subTextStyle = [
    styles.secondaryText,
    isSelected && styles.selectedText,
  ]
  
  return (
    <TouchableOpacity 
      style={cardStyle} 
      onPress={isDisabled ? undefined : onPress} // Do nothing if disabled
      activeOpacity={isDisabled ? 1.0 : 0.6}
    >
      <View style={styles.textContainer}>
        <Text style={textStyle}>{primaryText}</Text>
        <Text style={subTextStyle}>{secondaryText}</Text>
      </View>
      
      {isSelected && (
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
    marginBottom: 10,
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedCard: {
    borderColor: COLORS.primary,
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
  selectedText: {
    color: COLORS.primary,
  },
  checkmark: {
    marginLeft: 10,
  }
});

export default SelectionCard;