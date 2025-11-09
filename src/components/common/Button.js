import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

/**
 * Reusable Button Component
 * @param {object} props
 * @param {string} props.title - Buton metni
 * @param {function} props.onPress - Tıklama fonksiyonu
 * @param {string} props.variant - 'primary' | 'secondary' | 'outline' | 'text'
 * @param {string} props.size - 'small' | 'medium' | 'large'
 * @param {boolean} props.disabled - Disabled durumu
 * @param {boolean} props.loading - Loading durumu
 * @param {object} props.style - Ek stil
 */
export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  icon,
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? COLORS.surface : COLORS.primary} 
        />
      ) : (
        <>
          {icon && icon}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
  },
  
  // Variants
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  
  // Sizes
  small: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    minHeight: 36,
  },
  medium: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    minHeight: 44,
  },
  large: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    minHeight: 52,
  },
  
  // Text Styles
  primaryText: {
    color: COLORS.surface,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  secondaryText: {
    color: COLORS.surface,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  outlineText: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  textText: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  
  // Text Sizes
  smallText: {
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  mediumText: {
    fontSize: TYPOGRAPHY.sizes.md,
  },
  largeText: {
    fontSize: TYPOGRAPHY.sizes.lg,
  },
  
  // Disabled
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});

