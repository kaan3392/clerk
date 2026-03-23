import i18n from "@/i18n";
import { ClerkProvider, useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item;
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const queryClient = new QueryClient();

function InitialLayout() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const initLanguage = async () => {
      if (!isLoaded || !user) return;

      const clerkLang = user.unsafeMetadata?.language as string;
      const localLang = await AsyncStorage.getItem("user-language");

      if (clerkLang) {
        i18n.changeLanguage(clerkLang);
        await AsyncStorage.setItem("user-language", clerkLang);
      } else if (localLang) {
        i18n.changeLanguage(localLang);
      }
    };

    initLanguage();
  }, [user, isLoaded]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <QueryClientProvider client={queryClient}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="dark" />
          <InitialLayout />
        </SafeAreaView>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
