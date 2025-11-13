import { Stack } from "expo-router";
import React from "react";

export default function CheckoutLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="shipping" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="order_completed" />
    </Stack>
  );
}
