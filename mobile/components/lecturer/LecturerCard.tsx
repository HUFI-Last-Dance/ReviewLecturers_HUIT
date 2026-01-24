import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Lecturer } from '@/types/academic';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { DegreeBadge } from '@/components/ui/Badge';
import { Colors, Typography, Spacing } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useComparison } from '@/contexts';
import { ThumbsUp, ThumbsDown, MessageSquare, BookOpen, Flame, Check } from 'lucide-react-native';

interface LecturerCardProps {
    lecturer: Lecturer;
    showComparison?: boolean;
    style?: ViewStyle;
}

export function LecturerCard({ lecturer, showComparison = true, style }: LecturerCardProps) {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const { isSelected, addLecturer, removeLecturer } = useComparison();

    const selected = isSelected(lecturer.id);

    const handlePress = () => {
        router.push(`/lecturers/${lecturer.id}`);
    };

    const handleCompareToggle = () => {
        if (selected) {
            removeLecturer(lecturer.id);
        } else {
            addLecturer(lecturer);
        }
    };

    const netVotes = (lecturer.upvoteCount || 0) - (lecturer.downvoteCount || 0);

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
            <Card
                variant="elevated"
                padding="md"
                style={{
                    ...styles.card,
                    ...(selected ? { borderWidth: 2, borderColor: colors.primary } : {}),
                    ...(style || {}),
                }}
            >
                <View style={styles.container}>
                    {/* Avatar */}
                    <Avatar
                        source={lecturer.avatar}
                        name={lecturer.fullName}
                        size="lg"
                    />

                    {/* Info */}
                    <View style={styles.info}>
                        <View style={styles.nameRow}>
                            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                                {lecturer.fullName}
                            </Text>
                            {lecturer.degree && (
                                <DegreeBadge code={lecturer.degree.code} name={lecturer.degree.name} />
                            )}
                        </View>

                        {lecturer.email && (
                            <Text style={[styles.email, { color: colors.textSecondary }]} numberOfLines={1}>
                                {lecturer.email}
                            </Text>
                        )}

                        {/* Stats */}
                        <View style={styles.stats}>
                            {/* Votes */}
                            <View style={styles.stat}>
                                {netVotes >= 0 ? (
                                    <ThumbsUp size={14} color={colors.upvote} />
                                ) : (
                                    <ThumbsDown size={14} color={colors.downvote} />
                                )}
                                <Text style={[styles.statText, {
                                    color: netVotes >= 0 ? colors.upvote : colors.downvote
                                }]}>
                                    {Math.abs(netVotes)}
                                </Text>
                            </View>

                            {/* Assignments */}
                            <View style={styles.stat}>
                                <BookOpen size={14} color={colors.textSecondary} />
                                <Text style={[styles.statText, { color: colors.textSecondary }]}>
                                    {lecturer.assignmentsCount || lecturer._count?.teachingAssignments || 0}
                                </Text>
                            </View>

                            {/* Reviews */}
                            <View style={styles.stat}>
                                <MessageSquare size={14} color={colors.textSecondary} />
                                <Text style={[styles.statText, { color: colors.textSecondary }]}>
                                    {lecturer.reviewsCount || lecturer._count?.reviews || 0}
                                </Text>
                            </View>

                            {/* Engagement score */}
                            {lecturer.engagementScore !== undefined && lecturer.engagementScore > 0 && (
                                <View style={styles.stat}>
                                    <Flame size={14} color={colors.warning} />
                                    <Text style={[styles.statText, { color: colors.warning }]}>
                                        {lecturer.engagementScore.toFixed(1)}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Compare button */}
                    {showComparison && (
                        <TouchableOpacity
                            style={[
                                styles.compareButton,
                                {
                                    backgroundColor: selected ? colors.primary : colors.surface,
                                    borderColor: colors.border,
                                }
                            ]}
                            onPress={handleCompareToggle}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Check
                                size={16}
                                color={selected ? colors.primaryForeground : colors.textSecondary}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </Card>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: Spacing.base,
        marginBottom: Spacing.md,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    info: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        flexWrap: 'wrap',
    },
    name: {
        fontSize: Typography.fontSizes.base,
        fontWeight: Typography.fontWeights.semibold,
        flexShrink: 1,
    },
    email: {
        fontSize: Typography.fontSizes.sm,
        marginTop: 2,
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        marginTop: Spacing.sm,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: Typography.fontSizes.sm,
        fontWeight: Typography.fontWeights.medium,
    },
    compareButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Spacing.sm,
    },
});
