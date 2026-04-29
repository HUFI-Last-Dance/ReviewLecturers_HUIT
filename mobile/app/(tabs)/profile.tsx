import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts';
import { Colors, Typography, Spacing } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  LogOut,
  ChevronRight,
  Moon,
  Bell,
  Shield,
  HelpCircle,
  Info,
  User,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const MenuItem = ({
    icon,
    title,
    onPress,
    showArrow = true,
    danger = false,
  }: {
    icon: React.ReactNode;
    title: string;
    onPress?: () => void;
    showArrow?: boolean;
    danger?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={[styles.menuItemText, { color: danger ? colors.error : colors.text }]}>
          {title}
        </Text>
      </View>
      {showArrow && <ChevronRight size={20} color={colors.textMuted} />}
    </TouchableOpacity>
  );

  // Guest view
  if (!isLoading && !isAuthenticated) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Cá nhân</Text>
        </View>

        <View style={styles.guestContainer}>
          <User size={64} color={colors.textMuted} />
          <Text style={[styles.guestTitle, { color: colors.text }]}>
            Chào mừng đến ReviewLecturers
          </Text>
          <Text style={[styles.guestText, { color: colors.textSecondary }]}>
            Đăng nhập để đánh giá giảng viên và lưu danh sách yêu thích
          </Text>
          <View style={styles.authButtons}>
            <Button
              title="Đăng nhập"
              onPress={() => router.push('/auth/login')}
              style={{ flex: 1 }}
            />
            <Button
              title="Đăng ký"
              variant="outline"
              onPress={() => router.push('/auth/register')}
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* Settings for guests */}
        <Card variant="outlined" padding="none" style={styles.menuCard}>
          <MenuItem
            icon={<Moon size={20} color={colors.textSecondary} />}
            title="Giao diện tối"
            showArrow={false}
          />
          <MenuItem icon={<Info size={20} color={colors.textSecondary} />} title="Về ứng dụng" />
        </Card>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Cá nhân</Text>
        </View>

        {/* Profile Header */}
        <Card variant="elevated" padding="lg" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar source={user?.avatar} name={user?.fullName} size="xl" />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {user?.fullName || 'Người dùng'}
              </Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                {user?.email}
              </Text>
            </View>
          </View>
          <Button
            title="Chỉnh sửa hồ sơ"
            variant="outline"
            size="sm"
            style={{ marginTop: Spacing.md }}
          />
        </Card>

        {/* Menu Items */}
        <Card variant="outlined" padding="none" style={styles.menuCard}>
          <MenuItem icon={<Bell size={20} color={colors.textSecondary} />} title="Thông báo" />
          <MenuItem
            icon={<Moon size={20} color={colors.textSecondary} />}
            title="Giao diện tối"
            showArrow={false}
          />
          <MenuItem icon={<Shield size={20} color={colors.textSecondary} />} title="Bảo mật" />
        </Card>

        <Card variant="outlined" padding="none" style={styles.menuCard}>
          <MenuItem
            icon={<HelpCircle size={20} color={colors.textSecondary} />}
            title="Trợ giúp & Hỗ trợ"
          />
          <MenuItem icon={<Info size={20} color={colors.textSecondary} />} title="Về ứng dụng" />
        </Card>

        <Card variant="outlined" padding="none" style={styles.menuCard}>
          <MenuItem
            icon={<LogOut size={20} color={colors.error} />}
            title="Đăng xuất"
            onPress={handleLogout}
            showArrow={false}
            danger
          />
        </Card>

        <Text style={[styles.version, { color: colors.textMuted }]}>ReviewLecturers v1.0.0</Text>
      </ScrollView>
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
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing['3xl'],
  },
  guestTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.semibold,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  guestText: {
    fontSize: Typography.fontSizes.base,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  authButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
    width: '100%',
  },
  profileCard: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  profileName: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.semibold,
  },
  profileEmail: {
    fontSize: Typography.fontSizes.sm,
    marginTop: 2,
  },
  menuCard: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuItemText: {
    fontSize: Typography.fontSizes.base,
  },
  version: {
    textAlign: 'center',
    fontSize: Typography.fontSizes.sm,
    marginVertical: Spacing.xl,
  },
});
