import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ThumbsUp, ThumbsDown, MessageSquare, Calendar } from 'lucide-react-native';
import { Review } from '@/types';

interface ReviewCardProps {
    review: Review;
    onVote?: (reviewId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => void;
}

export function ReviewCard({ review, onVote }: ReviewCardProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <Card variant="outlined" padding="md" style={styles.reviewCard}>
            {/* Header */}
            <View style={styles.reviewHeader}>
                <Avatar
                    name={review.isAnonymous ? 'Ẩn danh' : review.author?.fullName}
                    size="sm"
                />
                <View style={styles.reviewMeta}>
                    <Text style={[styles.reviewAuthor, { color: colors.text }]}>
                        {review.isAnonymous ? 'Ẩn danh' : review.author?.fullName || 'Người dùng'}
                    </Text>
                    <View style={styles.reviewDateRow}>
                        <Calendar size={12} color={colors.textMuted} />
                        <Text style={[styles.reviewDate, { color: colors.textMuted }]}>
                            {formatDate(review.createdAt)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Content */}
            <Text style={[styles.reviewContent, { color: colors.text }]}>
                {review.content}
            </Text>

            {/* Feedback badges */}
            {(review.feedbackCommunication || review.feedbackKnowledge ||
                review.feedbackExpertise || review.feedbackAttitude) && (
                    <View style={styles.feedbackContainer}>
                        {review.feedbackCommunication && (
                            <Badge text={`Giao tiếp: ${review.feedbackCommunication}`} variant="info" />
                        )}
                        {review.feedbackKnowledge && (
                            <Badge text={`Kiến thức: ${review.feedbackKnowledge}`} variant="info" />
                        )}
                        {/* Add more as needed */}
                    </View>
                )}

            {/* Actions */}
            <View style={styles.reviewActions}>
                <TouchableOpacity
                    style={styles.voteAction}
                    onPress={() => onVote?.(review.id, 'UPVOTE')}
                >
                    <ThumbsUp
                        size={16}
                        color={review.userVote === 'UPVOTE' ? colors.upvote : colors.textSecondary}
                    />
                    <Text style={[styles.voteCount, {
                        color: review.userVote === 'UPVOTE' ? colors.upvote : colors.textSecondary
                    }]}>
                        {review.upvoteCount || 0}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.voteAction}
                    onPress={() => onVote?.(review.id, 'DOWNVOTE')}
                >
                    <ThumbsDown
                        size={16}
                        color={review.userVote === 'DOWNVOTE' ? colors.downvote : colors.textSecondary}
                    />
                    <Text style={[styles.voteCount, {
                        color: review.userVote === 'DOWNVOTE' ? colors.downvote : colors.textSecondary
                    }]}>
                        {review.downvoteCount || 0}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.voteAction}>
                    <MessageSquare size={16} color={colors.textSecondary} />
                    <Text style={[styles.voteCount, { color: colors.textSecondary }]}>
                        {review.repliesCount || 0}
                    </Text>
                </TouchableOpacity>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    reviewCard: {
        marginBottom: Spacing.md,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    reviewMeta: {
        marginLeft: Spacing.sm,
    },
    reviewAuthor: {
        fontSize: Typography.fontSizes.sm,
        fontWeight: Typography.fontWeights.medium,
    },
    reviewDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    reviewDate: {
        fontSize: Typography.fontSizes.xs,
    },
    reviewContent: {
        fontSize: Typography.fontSizes.base,
        lineHeight: 22,
    },
    feedbackContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
        marginTop: Spacing.sm,
    },
    reviewActions: {
        flexDirection: 'row',
        gap: Spacing.lg,
        marginTop: Spacing.md,
        paddingTop: Spacing.sm,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    voteAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    voteCount: {
        fontSize: Typography.fontSizes.sm,
    },
});
