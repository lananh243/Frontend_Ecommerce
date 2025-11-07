import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const categories = [
  { id: "1", title: "Women", icon: "gender-female", family: "MaterialCommunityIcons" },
  { id: "2", title: "Men", icon: "gender-male", family: "MaterialCommunityIcons" },
  { id: "3", title: "Accessories", icon: "glasses", family: "FontAwesome5" },
  { id: "4", title: "Beauty", icon: "paint-brush", family: "FontAwesome5" },
];

export default function CategorySection() {
  return (
    <View style={styles.container}>
      {categories.map((item) => (
        <TouchableOpacity key={item.id} style={styles.item} activeOpacity={0.8}>
          <View style={styles.iconCircle}>
            {item.family === "MaterialCommunityIcons" ? (
              <MaterialCommunityIcons name={item.icon as any} size={22} color="#000" />
            ) : (
              <FontAwesome5 name={item.icon as any} size={22} color="#000" />
            )}
          </View>
          <Text style={styles.text}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  item: {
    alignItems: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
});
