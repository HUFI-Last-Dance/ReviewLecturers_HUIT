import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider, ComparisonProvider } from '@/contexts';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 phút
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ComparisonProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
              <Stack.Screen
                name="lecturers/[id]"
                options={{
                  headerShown: true,
                  title: 'Chi tiết Giảng viên',
                }}
              />
              <Stack.Screen
                name="assignments/[id]"
                options={{
                  headerShown: true,
                  title: 'Chi tiết Phân công',
                }}
              />
              <Stack.Screen
                name="auth/login"
                options={{
                  headerShown: true,
                  title: 'Đăng nhập',
                  presentation: 'modal',
                }}
              />
              <Stack.Screen
                name="auth/register"
                options={{
                  headerShown: true,
                  title: 'Đăng ký',
                  presentation: 'modal',
                }}
              />
              <Stack.Screen
                name="comparison"
                options={{
                  headerShown: false,
                  presentation: 'fullScreenModal',
                }}
              />
            </Stack>
          </ThemeProvider>
        </ComparisonProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
