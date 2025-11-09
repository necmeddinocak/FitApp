import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

/**
 * Badge/Chip Component
 * @param {object} props
 * @param {string} props.label - Badge metni
 * @param {string} props.variant - 'primary' | 'secondary' | 'success' | 'warning' | 'info'
 * @param {object} props.style - Ek stil
 */
export const Badge = ({ label, variant = 'primary', style }) => {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text variant="caption" style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: RADIUS.xs,
    alignSelf: 'flex-start',
  },
  primary: {
    backgroundColor: COLORS.primaryLight + '40',
  },
  secondary: {
    backgroundColor: COLORS.secondaryLight + '40',
  },
  success: {
    backgroundColor: COLORS.success + '40',
  },
  warning: {
    backgroundColor: COLORS.warning + '40',
  },
  info: {
    backgroundColor: COLORS.info + '40',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});

