import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Shadows, Spacing } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'outlined' | 'clay';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    style?: ViewStyle;
}

export function Card({
    children,
    variant = 'default',
    padding = 'md',
    style
}: CardProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const getCardStyles = (): ViewStyle => {
        const paddingStyles: Record<string, ViewStyle> = {
            none: {},
            sm: { padding: Spacing.sm },
            md: { padding: Spacing.base },
            lg: { padding: Spacing.xl },
        };

        const variantStyles: Record<string, ViewStyle> = {
            default: {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
            },
            elevated: {
                backgroundColor: colors.surface,
                ...Shadows.md,
            },
            outlined: {
                backgroundColor: colors.background,
                borderWidth: 2,
                borderColor: colors.border,
            },
            clay: {
                backgroundColor: colors.surface,
                borderWidth: 0,
                ...Shadows.clay,
            },
        };

        return {
            borderRadius: BorderRadius.xl,
            ...paddingStyles[padding],
            ...variantStyles[variant],
        };
    };

    return (
        <View style={[getCardStyles(), style]}>
            {children}
        </View>
    );
}

// Card Header
interface CardHeaderProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export function CardHeader({ children, style }: CardHeaderProps) {
    return (
        <View style={[styles.header, style]}>
            {children}
        </View>
    );
}

// Card Content
interface CardContentProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export function CardContent({ children, style }: CardContentProps) {
    return (
        <View style={[styles.content, style]}>
            {children}
        </View>
    );
}

// Card Footer
interface CardFooterProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export function CardFooter({ children, style }: CardFooterProps) {
    return (
        <View style={[styles.footer, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        marginBottom: Spacing.md,
    },
    content: {
        // Default content styling
    },
    footer: {
        marginTop: Spacing.md,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: Spacing.sm,
    },
});
