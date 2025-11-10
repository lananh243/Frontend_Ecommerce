import { Slot, Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/services/queryClient";

export default function RootLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        router.replace("/(drawer)/(tabs)");
      } else {
        router.replace("/account/register");
      }
      setLoading(false);
    };
    checkAuth();
  }, []);


  return <QueryClientProvider client={queryClient}>
    <Slot/>
  </QueryClientProvider>;
}
