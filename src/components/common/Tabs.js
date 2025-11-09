import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Text } from './Text';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

/**
 * Tabs Component
 * @param {object} props
 * @param {Array} props.tabs - Tab listesi [{ key, label }]
 * @param {string} props.activeTab - Aktif tab key
 * @param {function} props.onTabChange - Tab değişim fonksiyonu
 */
export const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabChange(tab.key)}
          >
            <Text
              variant="body"
              weight={isActive ? 'semibold' : 'regular'}
              color={isActive ? COLORS.primary : COLORS.textSecondary}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 50,
  },
  contentContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  tab: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    marginRight: SPACING.sm,
  },
  activeTab: {
    backgroundColor: COLORS.primaryLight + '20',
  },
});

