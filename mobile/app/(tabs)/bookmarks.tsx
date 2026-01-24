import React from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookmarks } from '@/hooks/useAcademic';
import { LecturerCard } from '@/components/lecturer/LecturerCard';
import { LecturerCardSkeleton } from '@/components/ui/Skeleton';
import { Colors, Typography, Spacing } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/contexts';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { Bookmark } from 'lucide-react-native';
import { Lecturer } from '@/types';

export default function BookmarksScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const { data, isLoading, refetch, isRefetching } = useBookmarks();
    const lecturers = data?.data?.lecturers || [];

    const renderItem = ({ item }: { item: Lecturer }) => (
        <LecturerCard lecturer={item} showComparison={false} />
    );

    const renderEmpty = () => {
        if (isLoading) {
            return (
                <View style={styles.skeletonContainer}>
                    {[1, 2, 3].map((i) => (
                        <LecturerCardSkeleton key={i} />
                    ))}
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Bookmark size={48} color={colors.textMuted} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                    Chưa có giảng viên nào được lưu
                </Text>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    Nhấn vào biểu tượng bookmark trên trang giảng viên để lưu
                </Text>
            </View>
        );
    };

    // Chưa đăng nhập
    if (!authLoading && !isAuthenticated) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: colors.text }]}>Đã lưu</Text>
                </View>
                <View style={styles.authContainer}>
                    <Bookmark size={64} color={colors.textMuted} />
                    <Text style={[styles.authTitle, { color: colors.text }]}>
                        Đăng nhập để xem danh sách đã lưu
                    </Text>
                    <Text style={[styles.authText, { color: colors.textSecondary }]}>
                        Lưu giảng viên yêu thích để xem lại sau
                    </Text>
                    <Button
                        title="Đăng nhập"
                        onPress={() => router.push('/auth/login')}
                        style={{ marginTop: Spacing.lg }}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: colors.text }]}>Đã lưu</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                    {lecturers.length} giảng viên
                </Text>
            </View>

            <FlatList
                data={lecturers}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
            />
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
    listContent: {
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.xl,
        flexGrow: 1,
    },
    skeletonContainer: {
        paddingTop: Spacing.sm,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    emptyTitle: {
        fontSize: Typography.fontSizes.lg,
        fontWeight: Typography.fontWeights.semibold,
        marginTop: Spacing.lg,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: Typography.fontSizes.base,
        marginTop: Spacing.sm,
        textAlign: 'center',
    },
    authContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    authTitle: {
        fontSize: Typography.fontSizes.xl,
        fontWeight: Typography.fontWeights.semibold,
        marginTop: Spacing.lg,
        textAlign: 'center',
    },
    authText: {
        fontSize: Typography.fontSizes.base,
        marginTop: Spacing.sm,
        textAlign: 'center',
    },
});
