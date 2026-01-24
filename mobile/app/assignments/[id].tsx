import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAssignment } from '@/hooks/useAcademic';
import { useCreateReview, useVoteReview } from '@/hooks/useReview';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts';
import {
    ThumbsUp,
    ThumbsDown,
    MessageSquare,
    Send,
    User,
    Calendar,
} from 'lucide-react-native';
import { Review } from '@/types';

export default function AssignmentDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const { isAuthenticated, user } = useAuth();

    const { data, isLoading, isError } = useAssignment(id);
    const createReviewMutation = useCreateReview(id);
    const voteReviewMutation = useVoteReview();

    const [newReview, setNewReview] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    const assignment = data?.data;
    const reviews = assignment?.reviews || [];

    const handleSubmitReview = async () => {
        if (!newReview.trim()) return;

        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        try {
            await createReviewMutation.mutateAsync({
                content: newReview.trim(),
                isAnonymous,
            });
            setNewReview('');
        } catch (error) {
            console.error('Failed to submit review:', error);
        }
    };

    const handleVoteReview = (reviewId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }
        voteReviewMutation.mutate({ reviewId, voteType });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (isError || !assignment) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>
                    Không thể tải thông tin
                </Text>
                <Button title="Quay lại" onPress={() => router.back()} variant="outline" />
            </View>
        );
    }

    const ReviewCard = ({ review }: { review: Review }) => {
        const netVotes = (review.upvoteCount || 0) - (review.downvoteCount || 0);

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
                        </View>
                    )}

                {/* Actions */}
                <View style={styles.reviewActions}>
                    <TouchableOpacity
                        style={styles.voteAction}
                        onPress={() => handleVoteReview(review.id, 'UPVOTE')}
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
                        onPress={() => handleVoteReview(review.id, 'DOWNVOTE')}
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
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                    {/* Assignment Info */}
                    <Card variant="elevated" padding="lg" style={styles.infoCard}>
                        <Text style={[styles.subjectName, { color: colors.text }]}>
                            {assignment.subject?.name}
                        </Text>
                        <Text style={[styles.subjectCode, { color: colors.textSecondary }]}>
                            {assignment.subject?.code}
                        </Text>

                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                                    Giảng viên
                                </Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>
                                    {assignment.lecturer?.fullName}
                                </Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                                    Học kỳ
                                </Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>
                                    {assignment.term?.name}
                                </Text>
                            </View>
                        </View>

                        {assignment.classCode && (
                            <Badge text={`Lớp: ${assignment.classCode}`} variant="primary" />
                        )}
                    </Card>

                    {/* Reviews Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Đánh giá ({reviews.length})
                        </Text>

                        {reviews.length === 0 ? (
                            <Card variant="outlined" padding="lg" style={styles.emptyCard}>
                                <MessageSquare size={32} color={colors.textMuted} />
                                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                    Chưa có đánh giá nào. Hãy là người đầu tiên!
                                </Text>
                            </Card>
                        ) : (
                            reviews.map((review: Review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))
                        )}
                    </View>
                </ScrollView>

                {/* New Review Input */}
                <View style={[styles.inputContainer, {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                }]}>
                    <TouchableOpacity
                        style={styles.anonymousToggle}
                        onPress={() => setIsAnonymous(!isAnonymous)}
                    >
                        <User
                            size={20}
                            color={isAnonymous ? colors.primary : colors.textMuted}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.textInput, {
                            color: colors.text,
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        }]}
                        placeholder={isAuthenticated ? "Viết đánh giá..." : "Đăng nhập để đánh giá"}
                        placeholderTextColor={colors.textMuted}
                        value={newReview}
                        onChangeText={setNewReview}
                        multiline
                        editable={isAuthenticated}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, {
                            backgroundColor: newReview.trim() ? colors.primary : colors.surface
                        }]}
                        onPress={handleSubmitReview}
                        disabled={!newReview.trim() || createReviewMutation.isPending}
                    >
                        {createReviewMutation.isPending ? (
                            <ActivityIndicator size="small" color={colors.primaryForeground} />
                        ) : (
                            <Send
                                size={20}
                                color={newReview.trim() ? colors.primaryForeground : colors.textMuted}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        gap: Spacing.lg,
    },
    errorText: {
        fontSize: Typography.fontSizes.base,
        textAlign: 'center',
    },
    infoCard: {
        margin: Spacing.base,
    },
    subjectName: {
        fontSize: Typography.fontSizes['2xl'],
        fontWeight: Typography.fontWeights.bold,
    },
    subjectCode: {
        fontSize: Typography.fontSizes.base,
        marginTop: 4,
    },
    infoRow: {
        flexDirection: 'row',
        marginTop: Spacing.lg,
        gap: Spacing.xl,
    },
    infoItem: {
        flex: 1,
    },
    infoLabel: {
        fontSize: Typography.fontSizes.sm,
    },
    infoValue: {
        fontSize: Typography.fontSizes.base,
        fontWeight: Typography.fontWeights.medium,
        marginTop: 2,
    },
    section: {
        paddingHorizontal: Spacing.base,
        paddingBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: Typography.fontSizes.lg,
        fontWeight: Typography.fontWeights.semibold,
        marginBottom: Spacing.md,
    },
    emptyCard: {
        alignItems: 'center',
        gap: Spacing.sm,
    },
    emptyText: {
        fontSize: Typography.fontSizes.base,
        textAlign: 'center',
    },
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        borderTopWidth: 1,
        gap: Spacing.sm,
    },
    anonymousToggle: {
        padding: Spacing.sm,
    },
    textInput: {
        flex: 1,
        fontSize: Typography.fontSizes.base,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
