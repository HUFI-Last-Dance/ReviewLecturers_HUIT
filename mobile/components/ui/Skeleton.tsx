import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { Colors, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = BorderRadius.md,
  style,
}: SkeletonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as DimensionValue,
          height,
          borderRadius,
          backgroundColor: colors.skeleton,
          opacity,
        },
        style,
      ]}
    />
  );
}

// Skeleton cho Lecturer Card
export function LecturerCardSkeleton() {
  return (
    <View style={styles.lecturerCard}>
      <Skeleton width={56} height={56} borderRadius={28} />
      <View style={styles.lecturerInfo}>
        <Skeleton width="70%" height={18} />
        <Skeleton width="40%" height={14} style={{ marginTop: 8 }} />
        <Skeleton width="50%" height={14} style={{ marginTop: 4 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lecturerCard: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  lecturerInfo: {
    flex: 1,
    marginLeft: 12,
  },
});
