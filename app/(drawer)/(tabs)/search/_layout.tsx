import { Stack } from 'expo-router';
import React from 'react'

export default function DiscoverLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Các màn hình con */}
      <Stack.Screen name="index" />
      <Stack.Screen name="find" />
      <Stack.Screen name='filterProduct' />
      <Stack.Screen name='[id]' />
    </Stack>
  );
}