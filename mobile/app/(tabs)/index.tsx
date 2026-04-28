import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  FlatList,
  TextInput,
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLecturers } from '@/hooks/useAcademic';
import { LecturerCard } from '@/components/lecturer/LecturerCard';
import { LecturerCardSkeleton } from '@/components/ui/Skeleton';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useComparison } from '@/contexts';
import { Search, SlidersHorizontal, GitCompare } from 'lucide-react-native';
import { Lecturer } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { selectedLecturers, canCompare } = useComparison();

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, isError, refetch, isFetching } = useLecturers({
    page,
    limit: 20,
    search: searchQuery || undefined,
  });

  const lecturers = data?.data?.lecturers || [];
  const pagination = data?.data?.pagination;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const loadMore = useCallback(() => {
    if (pagination && page < pagination.totalPages && !isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [pagination, page, isFetching]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    setPage(1);
  }, []);

  const goToComparison = () => {
    router.push('/comparison' as any);
  };

  const renderItem = useCallback(({ item }: { item: Lecturer }) => (
    <LecturerCard lecturer={item} />
  ), []);

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Tìm kiếm giảng viên..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.filterButton}>
          <SlidersHorizontal size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      {pagination && (
        <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
          Tìm thấy {pagination.total} giảng viên
        </Text>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!isFetching || page === 1) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <LecturerCardSkeleton key={i} />
          ))}
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.error }]}>
            Có lỗi xảy ra. Vui lòng thử lại.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Không tìm thấy giảng viên nào
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Giảng viên</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          ReviewLecturers
        </Text>
      </View>

      <FlatList
        data={lecturers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />

      {/* Comparison FAB */}
      {selectedLecturers.length > 0 && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={goToComparison}
          activeOpacity={0.8}
        >
          <GitCompare size={24} color={colors.primaryForeground} />
          <View style={[styles.fabBadge, { backgroundColor: colors.error }]}>
            <Text style={styles.fabBadgeText}>{selectedLecturers.length}</Text>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSizes['3xl'],
    fontWeight: Typography.fontWeights.bold,
  },
  subtitle: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 2,
  },
  header: {
    paddingBottom: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSizes.base,
    paddingVertical: Spacing.xs,
  },
  filterButton: {
    padding: Spacing.xs,
  },
  resultCount: {
    fontSize: Typography.fontSizes.sm,
    marginTop: Spacing.md,
    marginHorizontal: Spacing.base,
  },
  listContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  loadingMore: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  skeletonContainer: {
    paddingTop: Spacing.sm,
  },
  emptyContainer: {
    paddingVertical: Spacing['3xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.fontSizes.base,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.base,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  fabBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

