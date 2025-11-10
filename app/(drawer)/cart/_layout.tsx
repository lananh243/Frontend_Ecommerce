import { Stack } from 'expo-router';
import React from 'react'

export default function CartLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Các màn hình con */}
      <Stack.Screen name="index" />
      <Stack.Screen name="shipping" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="order_completed" />
    </Stack>
  );
}