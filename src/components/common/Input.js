import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Text } from './Text';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../constants/theme';

/**
 * Reusable Input Component
 * @param {object} props
 * @param {string} props.label - Input etiketi
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input değeri
 * @param {function} props.onChangeText - Değişiklik fonksiyonu
 * @param {string} props.error - Hata mesajı
 * @param {React.ReactNode} props.icon - Sol ikon
 * @param {object} props.style - Ek stil
 */
export const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  icon,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text variant="caption" weight="medium" style={styles.label}>{label}</Text>}
      
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          value={value}
          onChangeText={onChangeText}
          {...props}
        />
      </View>
      
      {error && <Text variant="caption" color={COLORS.error} style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    marginBottom: SPACING.xs,
    color: COLORS.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  icon: {
    marginRight: SPACING.xs,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text,
  },
  error: {
    marginTop: SPACING.xs,
  },
});

