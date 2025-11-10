import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Image,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

export default function CustomDrawer(props: any) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>Sunie Pham</Text>
          <Text style={styles.email}>sunieux@gmail.com</Text>
        </View>

        {/* Menu Items */}
        <View style={{ flex: 1, paddingTop: 20 }}>
          <DrawerItemList {...props} />

          <View style={styles.otherSection}>
            <Text style={styles.otherTitle}>OTHER</Text>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="settings-outline" size={20} color="#555" />
              <Text style={styles.menuText}>Setting</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="mail-outline" size={20} color="#555" />
              <Text style={styles.menuText}>Support</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="information-circle-outline" size={20} color="#555" />
              <Text style={styles.menuText}>About us</Text>
            </TouchableOpacity>
          </View>
        </View>
      </DrawerContentScrollView>

      {/* Light / Dark Switch */}
      <View style={styles.themeSwitch}>
        <Ionicons name="sunny-outline" size={20} color={isDarkMode ? "#aaa" : "#333"} />
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: "#ddd", true: "#333" }}
          thumbColor={isDarkMode ? "#fff" : "#fff"}
        />
        <Ionicons name="moon-outline" size={20} color={isDarkMode ? "#333" : "#aaa"} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
  },
  email: {
    color: "#777",
    fontSize: 13,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 20,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 15,
    color: "#333",
  },
  otherSection: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
  otherTitle: {
    fontSize: 12,
    color: "#999",
    marginBottom: 10,
  },
  themeSwitch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingVertical: 15,
  },
});
