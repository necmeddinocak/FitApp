// Tema ve Renk Sistemi
export const COLORS = {
  // Ana Renkler
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  primaryDark: '#5849C4',
  
  // İkincil Renkler
  secondary: '#00B894',
  secondaryLight: '#55EFC4',
  secondaryDark: '#009874',
  
  // Durum Renkleri
  success: '#00B894',
  warning: '#FDCB6E',
  error: '#FF7675',
  danger: '#FF7675',
  info: '#74B9FF',
  
  // Gri Tonları (Light Mode)
  background: '#F8F9FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E9ECEF',
  
  // Text Renkleri (Light Mode)
  text: '#2D3436',
  textSecondary: '#636E72',
  textLight: '#B2BEC3',
  
  // Karanlık Mod
  darkBackground: '#1E1E1E',
  darkSurface: '#2D2D2D',
  darkCard: '#353535',
  darkBorder: '#404040',
  darkText: '#F5F5F5',
  darkTextSecondary: '#B0B0B0',
  darkTextLight: '#808080',
};

// Spacing Sistemi (8pt grid)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Tipografi
export const TYPOGRAPHY = {
  // Font Sizes
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  
  // Font Weights
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Border Radius
export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Shadows
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Animation Durations
export const DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Breakpoints
export const BREAKPOINTS = {
  small: 320,
  medium: 768,
  large: 1024,
};

