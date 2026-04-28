import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    TouchableOpacityProps,
} from 'react-native';
import { Colors, BorderRadius, Typography, Spacing, Shadows } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'clay';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export function Button({
    title,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    icon,
    iconPosition = 'left',
    style,
    ...props
}: ButtonProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const getButtonStyles = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            borderRadius: BorderRadius.xl,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: Spacing.sm,
        };

        // Size styles
        const sizeStyles: Record<string, ViewStyle> = {
            sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg },
            md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
            lg: { paddingVertical: Spacing.base, paddingHorizontal: Spacing.xl * 1.5 },
        };

        // Variant styles
        const variantStyles: Record<string, ViewStyle> = {
            primary: { backgroundColor: colors.primary },
            secondary: { backgroundColor: colors.surface },
            outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.border },
            ghost: { backgroundColor: 'transparent' },
            danger: { backgroundColor: colors.error },
            clay: {
                backgroundColor: colors.primary,
                borderWidth: 0,
                ...Shadows.clay,
            },
        };

        return {
            ...baseStyle,
            ...sizeStyles[size],
            ...variantStyles[variant],
            opacity: disabled || loading ? 0.5 : 1,
        };
    };

    const getTextStyles = (): TextStyle => {
        const sizeStyles: Record<string, TextStyle> = {
            sm: { fontSize: Typography.fontSizes.sm },
            md: { fontSize: Typography.fontSizes.base },
            lg: { fontSize: Typography.fontSizes.lg },
        };

        const variantStyles: Record<string, TextStyle> = {
            primary: { color: colors.primaryForeground },
            secondary: { color: colors.text },
            outline: { color: colors.text },
            ghost: { color: colors.primary },
            danger: { color: '#ffffff' },
            clay: { color: colors.primaryForeground },
        };

        return {
            fontWeight: Typography.fontWeights.semibold,
            ...sizeStyles[size],
            ...variantStyles[variant],
        };
    };

    return (
        <TouchableOpacity
            style={[getButtonStyles(), style]}
            disabled={disabled || loading}
            activeOpacity={0.7}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'primary' || variant === 'danger' ? '#fff' : colors.primary}
                />
            ) : (
                <>
                    {icon && iconPosition === 'left' && icon}
                    <Text style={getTextStyles()}>{title}</Text>
                    {icon && iconPosition === 'right' && icon}
                </>
            )}
        </TouchableOpacity>
    );
}
