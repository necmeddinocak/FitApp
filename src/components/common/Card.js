import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

/**
 * Reusable Card Component
 * @param {object} props
 * @param {React.ReactNode} props.children - Card içeriği
 * @param {object} props.style - Ek stil
 * @param {function} props.onPress - Tıklama fonksiyonu (opsiyonel)
 * @param {boolean} props.shadow - Gölge göster (default: true)
 */
export const Card = ({ 
  children, 
  style, 
  onPress, 
  shadow = true 
}) => {
  const cardStyle = [
    styles.card,
    shadow && SHADOWS.small,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity 
        style={cardStyle} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
});

