import { Stack } from "expo-router";
import React from "react";

export default function CartLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Trang giỏ hàng chính */}
      <Stack.Screen name="index" />

      {/* Nhánh checkout */}
      <Stack.Screen name="check_out" options={{ headerShown: false }} />
    </Stack>
  );
}
