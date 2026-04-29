import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useComparison } from '@/contexts';
import type { Lecturer } from '@/types/academic';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Avatar } from '@/components/ui/Avatar';
import { DegreeBadge } from '@/components/ui/Badge';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ThumbsUp, ThumbsDown, MessageSquare, BookOpen, Flame } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

interface ComparisonRowProps {
  label: string;
  icon?: LucideIcon;
  getValue: (lecturer: Lecturer) => React.ReactNode;
  color?: string;
}

export default function ComparisonScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { selectedLecturers, removeLecturer, clearAll } = useComparison();

  if (selectedLecturers.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ title: 'So sánh', headerShown: true }} />
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Chưa có giảng viên nào được chọn để so sánh.
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backButtonText, { color: colors.primaryForeground }]}>
              Quay lại trang chủ
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
        <X size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: colors.text }]}>So sánh giảng viên</Text>
      <TouchableOpacity onPress={clearAll}>
        <Text style={{ color: colors.error, fontWeight: '600' }}>Xóa hết</Text>
      </TouchableOpacity>
    </View>
  );

  const ComparisonRow = ({ label, icon: Icon, getValue, color }: ComparisonRowProps) => (
    <View style={styles.row}>
      <View style={styles.rowLabelContainer}>
        {Icon && <Icon size={16} color={color || colors.textSecondary} />}
        <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
      </View>
      <View style={styles.rowValues}>
        {selectedLecturers.map((lecturer) => (
          <View key={lecturer.id} style={styles.columnValue}>
            <Text style={[styles.valueText, { color: colors.text }]}>{getValue(lecturer)}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <Stack.Screen options={{ headerShown: false }} />
      {renderHeader()}

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Fixed Headers (Lecturer Info) */}
          <View style={styles.lecturerHeaders}>
            <View style={styles.rowLabelContainer} />
            <View style={styles.rowValues}>
              {selectedLecturers.map((lecturer) => (
                <View key={lecturer.id} style={styles.lecturerHeader}>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeLecturer(lecturer.id)}
                  >
                    <X size={14} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <Avatar source={lecturer.avatar} name={lecturer.fullName} size="lg" />
                  <Text style={[styles.lecturerName, { color: colors.text }]} numberOfLines={2}>
                    {lecturer.fullName}
                  </Text>
                  {lecturer.degree && (
                    <DegreeBadge code={lecturer.degree.code} name={lecturer.degree.name} />
                  )}
                </View>
              ))}
            </View>
          </View>

          <ScrollView style={styles.rowsContainer} showsVerticalScrollIndicator={false}>
            <ComparisonRow
              label="Đánh giá tích cực"
              icon={ThumbsUp}
              color={colors.upvote}
              getValue={(lecturer) => lecturer.upvoteCount || 0}
            />
            <ComparisonRow
              label="Đánh giá tiêu cực"
              icon={ThumbsDown}
              color={colors.downvote}
              getValue={(lecturer) => lecturer.downvoteCount || 0}
            />
            <ComparisonRow
              label="Số lượng review"
              icon={MessageSquare}
              getValue={(lecturer) => lecturer.reviewsCount || lecturer._count?.reviews || 0}
            />
            <ComparisonRow
              label="Số lượng học phần"
              icon={BookOpen}
              getValue={(lecturer) =>
                lecturer.assignmentsCount || lecturer._count?.teachingAssignments || 0
              }
            />
            <ComparisonRow
              label="Điểm tương tác"
              icon={Flame}
              color={colors.warning}
              getValue={(lecturer) => lecturer.engagementScore?.toFixed(1) || '0.0'}
            />
            <ComparisonRow label="Khoa" getValue={(lecturer) => lecturer.faculty?.name || 'N/A'} />
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
  },
  closeButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: Typography.fontSizes.base,
    marginBottom: Spacing.xl,
  },
  backButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  backButtonText: {
    fontWeight: '600',
  },
  lecturerHeaders: {
    flexDirection: 'row',
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lecturerHeader: {
    width: 150,
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  lecturerName: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.semibold,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: 4,
    height: 40,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: 10,
    zIndex: 10,
    padding: 4,
  },
  rowsContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  rowLabelContainer: {
    width: 140,
    paddingHorizontal: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowLabel: {
    fontSize: Typography.fontSizes.sm,
    fontWeight: Typography.fontWeights.medium,
  },
  rowValues: {
    flexDirection: 'row',
  },
  columnValue: {
    width: 150,
    alignItems: 'center',
  },
  valueText: {
    fontSize: Typography.fontSizes.base,
    fontWeight: Typography.fontWeights.semibold,
  },
});
