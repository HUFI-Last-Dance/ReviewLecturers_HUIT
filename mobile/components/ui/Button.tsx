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
import { Colors, BorderRadius, Typography, Spacing } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
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
            borderRadius: BorderRadius.lg,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: Spacing.sm,
        };

        // Size styles
        const sizeStyles: Record<string, ViewStyle> = {
            sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
            md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg },
            lg: { paddingVertical: Spacing.base, paddingHorizontal: Spacing.xl },
        };

        // Variant styles
        const variantStyles: Record<string, ViewStyle> = {
            primary: { backgroundColor: colors.primary },
            secondary: { backgroundColor: colors.surface },
            outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
            ghost: { backgroundColor: 'transparent' },
            danger: { backgroundColor: colors.error },
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
