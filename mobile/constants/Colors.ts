// Màu sắc chính cho app ReviewLecturers
export const Colors = {
  light: {
    // Primary colors
    primary: '#6366f1', // Indigo
    primaryForeground: '#ffffff',

    // Background & Surface
    background: '#ffffff',
    surface: '#f8fafc',
    surfaceHover: '#f1f5f9',

    // Text
    text: '#0f172a',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',

    // Border
    border: '#e2e8f0',
    borderLight: '#f1f5f9',

    // Status
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Vote colors
    upvote: '#22c55e',
    downvote: '#ef4444',

    // Tab bar
    tabIconDefault: '#94a3b8',
    tabIconSelected: '#6366f1',

    // Skeleton
    skeleton: '#e2e8f0',
    skeletonHighlight: '#f1f5f9',
  },
  dark: {
    // Primary colors
    primary: '#818cf8', // Lighter indigo for dark mode
    primaryForeground: '#0f172a',

    // Background & Surface
    background: '#0f172a',
    surface: '#1e293b',
    surfaceHover: '#334155',

    // Text
    text: '#f8fafc',
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
    tabIconSelected: '#818cf8',

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
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
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
};
