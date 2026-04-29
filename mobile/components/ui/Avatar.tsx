import React from 'react';
import { View, Image, Text, ViewStyle } from 'react-native';
import { Colors, Typography } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

export function Avatar({ source, name, size = 'md', style }: AvatarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  };

  const fontSizeMap = {
    sm: Typography.fontSizes.xs,
    md: Typography.fontSizes.sm,
    lg: Typography.fontSizes.lg,
    xl: Typography.fontSizes['2xl'],
  };

  const dimension = sizeMap[size];
  const fontSize = fontSizeMap[size];

  // Lấy initials từ tên
  const getInitials = (name?: string) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  // Generate màu từ tên
  const getColorFromName = (name?: string) => {
    const colorPalette = [
      '#f87171',
      '#fb923c',
      '#fbbf24',
      '#a3e635',
      '#34d399',
      '#22d3d8',
      '#60a5fa',
      '#818cf8',
      '#c084fc',
      '#f472b6',
    ];
    if (!name) return colorPalette[0];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colorPalette[hash % colorPalette.length];
  };

  const containerStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2,
    backgroundColor: source ? colors.surface : getColorFromName(name),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  };

  if (source) {
    return (
      <View style={[containerStyle, style]}>
        <Image
          source={{ uri: source }}
          style={{ width: dimension, height: dimension }}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      <Text style={{ fontSize, color: '#ffffff', fontWeight: Typography.fontWeights.semibold }}>
        {getInitials(name)}
      </Text>
    </View>
  );
}
