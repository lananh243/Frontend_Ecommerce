import { Stack } from 'expo-router';
import React from 'react'

export default function OrderLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Các màn hình con */}
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}