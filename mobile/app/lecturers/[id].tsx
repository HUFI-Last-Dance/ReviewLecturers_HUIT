import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLecturer, useVoteLecturer } from '@/hooks/useAcademic';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { DegreeBadge, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts';
import {
  ThumbsUp,
  ThumbsDown,
  Mail,
  BookOpen,
  MessageSquare,
  ChevronRight,
  Bookmark,
} from 'lucide-react-native';
import { TeachingAssignment } from '@/types';

export default function LecturerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { isAuthenticated } = useAuth();

  const { data, isLoading, isError } = useLecturer(id);
  const voteMutation = useVoteLecturer();

  const lecturer = data?.data;
  const assignments = lecturer?.teachingAssignments || [];

  const handleVote = (voteType: 'UPVOTE' | 'DOWNVOTE') => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    voteMutation.mutate({ id, voteType });
  };

  const goToAssignment = (assignmentId: string) => {
    router.push(`/assignments/${assignmentId}`);
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || !lecturer) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          Không thể tải thông tin giảng viên
        </Text>
        <Button title="Thử lại" onPress={() => router.back()} variant="outline" />
      </View>
    );
  }

  const netVotes = (lecturer.upvoteCount || 0) - (lecturer.downvoteCount || 0);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['bottom']}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <Card variant="elevated" padding="lg" style={styles.headerCard}>
          <View style={styles.headerTop}>
            <Avatar source={lecturer.avatar} name={lecturer.fullName} size="xl" />
            <TouchableOpacity style={[styles.bookmarkButton, { borderColor: colors.border }]}>
              <Bookmark
                size={20}
                color={lecturer.isBookmarked ? colors.primary : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.name, { color: colors.text }]}>{lecturer.fullName}</Text>

          {lecturer.degree && (
            <View style={styles.degreeRow}>
              <DegreeBadge code={lecturer.degree.code} name={lecturer.degree.name} />
            </View>
          )}

          {lecturer.email && (
            <View style={styles.emailRow}>
              <Mail size={16} color={colors.textSecondary} />
              <Text style={[styles.email, { color: colors.textSecondary }]}>{lecturer.email}</Text>
            </View>
          )}

          {/* Stats */}
          <View style={[styles.statsContainer, { borderColor: colors.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {lecturer.assignmentsCount || lecturer._count?.teachingAssignments || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Phân công</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {lecturer.reviewsCount || lecturer._count?.reviews || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Đánh giá</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text
                style={[
                  styles.statValue,
                  {
                    color: netVotes >= 0 ? colors.upvote : colors.downvote,
                  },
                ]}
              >
                {netVotes >= 0 ? '+' : ''}
                {netVotes}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Điểm</Text>
            </View>
          </View>

          {/* Vote Buttons */}
          <View style={styles.voteContainer}>
            <TouchableOpacity
              style={[
                styles.voteButton,
                {
                  backgroundColor:
                    lecturer.myVote === 'UPVOTE' ? colors.upvote + '20' : colors.surface,
                  borderColor: lecturer.myVote === 'UPVOTE' ? colors.upvote : colors.border,
                },
              ]}
              onPress={() => handleVote('UPVOTE')}
            >
              <ThumbsUp
                size={20}
                color={lecturer.myVote === 'UPVOTE' ? colors.upvote : colors.textSecondary}
              />
              <Text
                style={[
                  styles.voteText,
                  {
                    color: lecturer.myVote === 'UPVOTE' ? colors.upvote : colors.text,
                  },
                ]}
              >
                {lecturer.upvoteCount || 0}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.voteButton,
                {
                  backgroundColor:
                    lecturer.myVote === 'DOWNVOTE' ? colors.downvote + '20' : colors.surface,
                  borderColor: lecturer.myVote === 'DOWNVOTE' ? colors.downvote : colors.border,
                },
              ]}
              onPress={() => handleVote('DOWNVOTE')}
            >
              <ThumbsDown
                size={20}
                color={lecturer.myVote === 'DOWNVOTE' ? colors.downvote : colors.textSecondary}
              />
              <Text
                style={[
                  styles.voteText,
                  {
                    color: lecturer.myVote === 'DOWNVOTE' ? colors.downvote : colors.text,
                  },
                ]}
              >
                {lecturer.downvoteCount || 0}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Assignments Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Phân công giảng dạy ({assignments.length})
          </Text>

          {assignments.length === 0 ? (
            <Card variant="outlined" padding="lg" style={styles.emptyCard}>
              <BookOpen size={32} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Chưa có phân công giảng dạy
              </Text>
            </Card>
          ) : (
            assignments.map((assignment: TeachingAssignment) => (
              <TouchableOpacity
                key={assignment.id}
                onPress={() => goToAssignment(assignment.id)}
                activeOpacity={0.7}
              >
                <Card variant="outlined" padding="md" style={styles.assignmentCard}>
                  <View style={styles.assignmentContent}>
                    <View style={styles.assignmentInfo}>
                      <Text style={[styles.subjectName, { color: colors.text }]}>
                        {assignment.subject?.name}
                      </Text>
                      <Text style={[styles.subjectCode, { color: colors.textSecondary }]}>
                        {assignment.subject?.code} • {assignment.term?.name}
                      </Text>
                      {assignment.classCode && (
                        <Badge text={assignment.classCode} variant="default" />
                      )}
                    </View>
                    <View style={styles.assignmentMeta}>
                      <View style={styles.reviewCount}>
                        <MessageSquare size={14} color={colors.textSecondary} />
                        <Text style={[styles.reviewCountText, { color: colors.textSecondary }]}>
                          {assignment.reviewsCount || 0}
                        </Text>
                      </View>
                      <ChevronRight size={20} color={colors.textMuted} />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  headerCard: {
    margin: Spacing.base,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: Typography.fontSizes['2xl'],
    fontWeight: Typography.fontWeights.bold,
    marginTop: Spacing.md,
  },
  degreeRow: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  email: {
    fontSize: Typography.fontSizes.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  statValue: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
  },
  statLabel: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 2,
  },
  voteContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  voteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  voteText: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.fontWeights.semibold,
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
  },
  assignmentCard: {
    marginBottom: Spacing.sm,
  },
  assignmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignmentInfo: {
    flex: 1,
    gap: 4,
  },
  subjectName: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.fontWeights.medium,
  },
  subjectCode: {
    fontSize: Typography.fontSizes.sm,
  },
  assignmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  reviewCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewCountText: {
    fontSize: Typography.fontSizes.sm,
  },
});
