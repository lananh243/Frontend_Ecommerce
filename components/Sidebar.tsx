import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/auth";
import { ActivityIndicator } from "react-native-paper";
import { useRouter, usePathname, Href } from "expo-router";

export default function Sidebar(props: any) {
  const router = useRouter();
  const pathname = usePathname();
  const systemTheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemTheme === "dark");

  const toggleTheme = () => setIsDark((prev) => !prev);

  // 🔹 Fetch user profile
  const { data: user, isLoading, isError, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const backgroundColor = isDark ? "#121212" : "#fff";
  const textColor = isDark ? "#f5f5f5" : "#000";
  const iconColor = isDark ? "#e0e0e0" : "#333";
  const inactiveColor = isDark ? "#aaa" : "#555";
  const activeBg = isDark ? "#1e1e1e" : "#f3f3f3";

  const handleNavigation = (route: Href) => {
    props.navigation.closeDrawer();
    router.push(route);
  };

  const MenuItem = ({ icon, label, route }: any) => {
    const isActive = pathname === route;
    return (
      <TouchableOpacity
        style={[
          styles.menuItem,
          isActive && { backgroundColor: activeBg, borderRadius: 12 },
        ]}
        onPress={() => handleNavigation(route)}
      >
        <Ionicons
          name={icon}
          size={20}
          color={isActive ? "#007AFF" : iconColor}
        />
        <Text
          style={[
            styles.menuText,
            { color: isActive ? "#007AFF" : textColor },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (isError || !user) {
    return (
      <View style={[styles.center, { backgroundColor }]}>
        <Text style={{ color: textColor }}>Không thể tải thông tin người dùng</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text style={{ color: "#007AFF", marginTop: 10 }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[styles.container, { backgroundColor }]}
    >
      {/* 🔹 Header */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri:
              user.avatarUrl ||
              "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
          }}
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: textColor }]}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={[styles.email, { color: inactiveColor }]}>
          {user.email}
        </Text>
      </View>

      {/* 🔹 Menu */}
      <View style={styles.menuSection}>
        <MenuItem icon="home-outline" label="Homepage" route="/(drawer)/(tabs)" />
        <MenuItem icon="search-outline" label="Discover" route="/(drawer)/(tabs)/search" />
        <MenuItem icon="bag-outline" label="My Order" route="/order" />
        <MenuItem icon="person-outline" label="My profile" route="/(drawer)/(tabs)/profile" />
      </View>

      {/* 🔹 Other Section */}
      <Text style={[styles.otherLabel, { color: inactiveColor }]}>OTHER</Text>
      <View style={styles.menuSection}>
        <MenuItem icon="settings-outline" label="Setting" route="/setting" />
        <MenuItem icon="mail-outline" label="Support" route="/support" />
        <MenuItem icon="information-circle-outline" label="About us" route="/about" />
      </View>

      {/* 🔹 Theme Toggle */}
      <View style={styles.themeContainer}>
        <View style={styles.themeOption}>
          <Ionicons name="sunny-outline" size={18} color={iconColor} />
          <Text style={[styles.themeText, { color: textColor }]}>Light</Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: "#ccc", true: "#007AFF" }}
          thumbColor="#fff"
        />
        <View style={styles.themeOption}>
          <Ionicons name="moon-outline" size={18} color={iconColor} />
          <Text style={[styles.themeText, { color: textColor }]}>Dark</Text>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
  },
  email: {
    fontSize: 13,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  menuText: {
    fontSize: 15,
    marginLeft: 15,
  },
  otherLabel: {
    fontSize: 12,
    marginLeft: 20,
    marginBottom: 5,
  },
  themeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  themeText: {
    fontSize: 13,
  },
});
