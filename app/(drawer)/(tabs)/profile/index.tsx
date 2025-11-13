import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "@/services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Gọi API qua TanStack Query
  const { data: user, isLoading, isError, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    refetchOnMount: true,
  });

  const menuItems = [
    { icon: "id-card-outline", text: "Information", route: "/profile/update_profile" },
    { icon: "heart-outline", text: "My Wishlist", route: "/wishlist" },
    { icon: "log-out-outline", text: "Log out" },
  ];

  // Logout
  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("userInfo");

            queryClient.clear();

            router.push("/account/login");
          } catch (err) {
            console.error("Lỗi khi đăng xuất:", err);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (isError || !user) {
    return (
      <View style={styles.center}>
        <Text>Không thể tải thông tin người dùng </Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text style={{ color: "blue", marginTop: 10 }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Profile */}
      <View style={styles.header}>
        <Image
          source={{
            uri: user.avatarUrl || "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
          }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>
            {user.firstName || ""} {user.lastName || ""}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={22} color="black" />
        </TouchableOpacity>
      </View>

      {/* Menu List */}
      <View style={styles.card}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              if (item.text === "Log out") {
                handleLogout();
              } else if (item.route) {
                router.push(item.route as any);
              }
            }}
          >
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon as any} size={22} color="#8a8a8a" />
              <Text style={styles.menuText}>{item.text}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#8a8a8a" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: "85%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f4f4f4",
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  email: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  settingsButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
  },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 15,
    color: "#444",
    marginLeft: 15,
  },
});
