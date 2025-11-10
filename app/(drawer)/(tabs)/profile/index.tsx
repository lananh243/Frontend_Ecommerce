import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, Feather, MaterialIcons, FontAwesome5, Entypo } from "@expo/vector-icons";

export default function ProfileScreen() {
  const menuItems = [
    { icon: "location-outline", text: "Address" },
    { icon: "card-outline", text: "Payment method" },
    { icon: "gift-outline", text: "Voucher" },
    { icon: "heart-outline", text: "My Wishlist" },
    { icon: "star-outline", text: "Rate this app" },
    { icon: "log-out-outline", text: "Log out" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Profile */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://i.pravatar.cc/150?img=47",
          }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>Sunie Pham</Text>
          <Text style={styles.email}>sunieux@gmail.com</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={22} color="black" />
        </TouchableOpacity>
      </View>

      {/* Menu List */}
      <View style={styles.card}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
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
