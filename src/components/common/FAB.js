import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS } from '../../constants/theme';

/**
 * Floating Action Button (FAB)
 * @param {object} props
 * @param {string} props.icon - İkon adı
 * @param {function} props.onPress - Tıklama fonksiyonu
 * @param {string} props.position - 'right' | 'left' | 'center'
 */
export const FAB = ({ icon = 'add', onPress, position = 'right' }) => {
  return (
    <TouchableOpacity
      style={[styles.fab, styles[position]]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={28} color={COLORS.surface} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  right: {
    right: SPACING.lg,
  },
  left: {
    left: SPACING.lg,
  },
  center: {
    alignSelf: 'center',
  },
});

