import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Typography, Spacing } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface BadgeProps {
    text: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
    size?: 'sm' | 'md';
    style?: ViewStyle;
}

export function Badge({ text, variant = 'default', size = 'sm', style }: BadgeProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const getStyles = () => {
        const variants: Record<string, { bg: string; text: string }> = {
            default: { bg: colors.surface, text: colors.textSecondary },
            primary: { bg: colors.primary + '20', text: colors.primary },
            success: { bg: colors.success + '20', text: colors.success },
            warning: { bg: colors.warning + '20', text: colors.warning },
            error: { bg: colors.error + '20', text: colors.error },
            info: { bg: colors.info + '20', text: colors.info },
        };

        const sizeStyles = {
            sm: { paddingVertical: 2, paddingHorizontal: 8, fontSize: Typography.fontSizes.xs },
            md: { paddingVertical: 4, paddingHorizontal: 12, fontSize: Typography.fontSizes.sm },
        };

        return {
            container: {
                backgroundColor: variants[variant].bg,
                paddingVertical: sizeStyles[size].paddingVertical,
                paddingHorizontal: sizeStyles[size].paddingHorizontal,
                borderRadius: BorderRadius.full,
            } as ViewStyle,
            text: {
                color: variants[variant].text,
                fontSize: sizeStyles[size].fontSize,
                fontWeight: Typography.fontWeights.medium,
            },
        };
    };

    const styles = getStyles();

    return (
        <View style={[styles.container, style]}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

// Degree Badge (cho học vị giảng viên)
interface DegreeBadgeProps {
    code: string;
    name?: string;
    style?: ViewStyle;
}

export function DegreeBadge({ code, name, style }: DegreeBadgeProps) {
    const degreeColors: Record<string, 'info' | 'primary' | 'success' | 'warning'> = {
        'ThS': 'info',
        'TS': 'primary',
        'PGS': 'success',
        'GS': 'warning',
        'CN': 'default' as any,
        'KS': 'default' as any,
    };

    return (
        <Badge
            text={name || code}
            variant={degreeColors[code] || 'default'}
            size="sm"
            style={style}
        />
    );
}
