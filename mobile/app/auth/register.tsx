import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const { register } = useAuth();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!fullName || !email || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setIsLoading(true);
        try {
            await register({ email, password, fullName });
            Alert.alert('Thành công', 'Đăng ký tài khoản thành công!');
            router.back();
        } catch (error: any) {
            Alert.alert(
                'Đăng ký thất bại',
                error?.response?.data?.message || 'Vui lòng thử lại sau'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.text }]}>
                            Tạo tài khoản
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Đăng ký để bắt đầu đánh giá giảng viên
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Full Name */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Họ và tên</Text>
                            <View style={[styles.inputContainer, {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                            }]}>
                                <User size={20} color={colors.textSecondary} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="Nguyễn Văn A"
                                    placeholderTextColor={colors.textMuted}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                            <View style={[styles.inputContainer, {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                            }]}>
                                <Mail size={20} color={colors.textSecondary} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="your@email.com"
                                    placeholderTextColor={colors.textMuted}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Mật khẩu</Text>
                            <View style={[styles.inputContainer, {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                            }]}>
                                <Lock size={20} color={colors.textSecondary} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="Ít nhất 6 ký tự"
                                    placeholderTextColor={colors.textMuted}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <EyeOff size={20} color={colors.textSecondary} />
                                    ) : (
                                        <Eye size={20} color={colors.textSecondary} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Xác nhận mật khẩu</Text>
                            <View style={[styles.inputContainer, {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                            }]}>
                                <Lock size={20} color={colors.textSecondary} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="Nhập lại mật khẩu"
                                    placeholderTextColor={colors.textMuted}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Register button */}
                        <Button
                            title="Đăng ký"
                            onPress={handleRegister}
                            loading={isLoading}
                            style={styles.registerButton}
                        />

                        {/* Login link */}
                        <View style={styles.loginContainer}>
                            <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                                Đã có tài khoản?
                            </Text>
                            <TouchableOpacity onPress={() => router.replace('/auth/login')}>
                                <Text style={[styles.loginLink, { color: colors.primary }]}>
                                    {' '}Đăng nhập
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
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
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: Spacing.xl,
    },
    header: {
        marginTop: Spacing['2xl'],
        marginBottom: Spacing['2xl'],
    },
    title: {
        fontSize: Typography.fontSizes['3xl'],
        fontWeight: Typography.fontWeights.bold,
    },
    subtitle: {
        fontSize: Typography.fontSizes.base,
        marginTop: Spacing.sm,
    },
    form: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: Spacing.lg,
    },
    label: {
        fontSize: Typography.fontSizes.sm,
        fontWeight: Typography.fontWeights.medium,
        marginBottom: Spacing.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        gap: Spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: Typography.fontSizes.base,
        paddingVertical: Spacing.xs,
    },
    registerButton: {
        marginTop: Spacing.md,
        marginBottom: Spacing.lg,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.lg,
    },
    loginText: {
        fontSize: Typography.fontSizes.base,
    },
    loginLink: {
        fontSize: Typography.fontSizes.base,
        fontWeight: Typography.fontWeights.semibold,
    },
});
