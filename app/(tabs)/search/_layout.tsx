import { Stack } from 'expo-router';
import React from 'react'

export default function SearchLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right", 
      }}
    >
      {/* Các màn hình con */}
      <Stack.Screen name="index" />
      <Stack.Screen name="find" />
      <Stack.Screen name='filterProduct' />
      <Stack.Screen name='detailProduct' />
    </Stack>
  );
}