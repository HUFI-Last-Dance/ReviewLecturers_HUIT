// Màu sắc chính cho app ReviewLecturers
export const Colors = {
  light: {
    // Primary colors
    primary: '#0ea5e9', // Sky Blue
    primaryForeground: '#ffffff',

    // Background & Surface
    background: '#f0f9ff', // Soft Blue BG
    surface: '#ffffff',
    surfaceHover: '#f8fafc',

    // Text
    text: '#0c4a6e', // Deep Blue
    textSecondary: '#334155',
    textMuted: '#64748b',

    // Border
    border: '#e0f2fe',
    borderLight: '#f0f9ff',

    // Status
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#0ea5e9',

    // Vote colors
    upvote: '#22c55e',
    downvote: '#ef4444',

    // Tab bar
    tabIconDefault: '#94a3b8',
    tabIconSelected: '#0ea5e9',

    // Skeleton
    skeleton: '#e2e8f0',
    skeletonHighlight: '#f1f5f9',
  },
  dark: {
    // Primary colors
    primary: '#38bdf8', // Light sky blue
    primaryForeground: '#0f172a',

    // Background & Surface
    background: '#0f172a',
    surface: '#1e293b',
    surfaceHover: '#334155',

    // Text
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',

    // Border
    border: '#334155',
    borderLight: '#1e293b',

    // Status
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',

    // Vote colors
    upvote: '#4ade80',
    downvote: '#f87171',

    // Tab bar
    tabIconDefault: '#64748b',
    tabIconSelected: '#38bdf8',

    // Skeleton
    skeleton: '#334155',
    skeletonHighlight: '#475569',
  },
};

// Typography
export const Typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  fontWeights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
};

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

// Border radius
export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  clay: {
    shadowColor: '#0c4a6e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
};
