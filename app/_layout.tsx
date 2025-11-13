import { Stack, useRouter } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/services/queryClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        // Delay nhỏ để đảm bảo router đã mount
        setTimeout(() => {
          router.replace(token ? "/(drawer)/(tabs)" : "/account/login");
        }, 0);
      } catch (err) {
        console.error("Auth check error:", err);
        setTimeout(() => router.replace("/account/login"), 0);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Giữ màn loading khi đang kiểm tra
  if (checkingAuth) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(drawer)" />
          <Stack.Screen name="account" />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
