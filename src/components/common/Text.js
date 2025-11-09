import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../constants/theme';

/**
 * Reusable Text Component
 * @param {object} props
 * @param {React.ReactNode} props.children - Text içeriği
 * @param {string} props.variant - 'heading1' | 'heading2' | 'heading3' | 'body' | 'caption' | 'label'
 * @param {string} props.color - Text rengi
 * @param {string} props.weight - Font weight
 * @param {object} props.style - Ek stil
 */
export const Text = ({
  children,
  variant = 'body',
  color,
  weight,
  style,
  ...props
}) => {
  const textStyle = [
    styles.base,
    styles[variant],
    color && { color },
    weight && { fontWeight: TYPOGRAPHY.weights[weight] },
    style,
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    color: COLORS.text,
  },
  
  // Variants
  heading1: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    lineHeight: TYPOGRAPHY.sizes.xxxl * TYPOGRAPHY.lineHeights.tight,
  },
  heading2: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    lineHeight: TYPOGRAPHY.sizes.xxl * TYPOGRAPHY.lineHeights.tight,
  },
  heading3: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.semibold,
    lineHeight: TYPOGRAPHY.sizes.xl * TYPOGRAPHY.lineHeights.tight,
  },
  body: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.regular,
    lineHeight: TYPOGRAPHY.sizes.md * TYPOGRAPHY.lineHeights.normal,
  },
  caption: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.regular,
    color: COLORS.textSecondary,
    lineHeight: TYPOGRAPHY.sizes.sm * TYPOGRAPHY.lineHeights.normal,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

