// components/ProgressIndicator.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../app/constants/Styles';

interface ProgressProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressProps> = ({ currentStep, totalSteps }) => {
  // Create an array to represent the steps (e.g., [1, 2, 3] for 3 steps)
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          {/* 1. Step Circle */}
          <View style={[
            styles.circle,
            step <= currentStep && styles.activeCircle, // Active/Checked
            step < currentStep && styles.checkedCircle, // Checked (past steps)
          ]}>
            {step < currentStep ? (
              <Ionicons name="checkmark" size={12} color={COLORS.secondary} />
            ) : (
              <View style={step === currentStep ? styles.currentDot : styles.inactiveDot} />
            )}
          </View>

          {/* 2. Line Separator (between circles) */}
          {index < totalSteps - 1 && (
            <View style={[
              styles.line,
              step < currentStep && styles.activeLine // Line is active if the preceding step is complete
            ]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.textFaded,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    borderColor: COLORS.primary,
  },
  checkedCircle: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  currentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textFaded,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.textFaded,
    marginHorizontal: 4,
  },
  activeLine: {
    backgroundColor: COLORS.primary,
  },
});

export default ProgressIndicator;