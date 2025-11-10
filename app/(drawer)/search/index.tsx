import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const DiscoverScreen = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const clothingItems = [
    { name: "Jacket", count: 128 },
    { name: "Skirts", count: 40 },
    { name: "Dresses", count: 36 },
    { name: "Sweaters", count: 24 },
    { name: "Jeans", count: 14 },
    { name: "T-Shirts", count: 12 },
    { name: "Pants", count: 9 },
  ];

  const accessorieItems = [
    {name: "Bag", count: 56},
    {name: "Jewelry", count: 26},
    {name: "Watch", count: 45}
  ];

  const shoeItems = [
    {name: "High Heels", count: 34},
    {name: "Sneakers", count: 67},
    {name: "Boots", count: 38}
  ];

  const collectionItems = [
    {name: "Winter 2024", count: 54},
    {name: "Summer 2025", count: 69},
  ]

  // Hàm xử lý toggle
  const handleToggle = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="menu-outline" size={26} color="#000" />
        <Text style={styles.title}>Discover</Text>
        <Ionicons name="notifications-outline" size={26} color="#000" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <TouchableOpacity style={styles.searchContainer} onPress={() => router.push("/search/find")}>
            <Ionicons name="search-outline" size={18} color="#8C8C8C" />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#8C8C8C"
              style={styles.searchInput}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={18} color="#8C8C8C" />
          </TouchableOpacity>
        </View>


        {/* CLOTHING Section */}
        <TouchableOpacity
          style={[styles.categoryCard, { backgroundColor: "#b0b2aa" }]}
          onPress={() => handleToggle("CLOTHING")}
        >
          <Text style={styles.categoryText}>CLOTHING</Text>
          <Image
            source={require("@/assets/images/clothing.png")}
            style={styles.categoryImage}
          />
        </TouchableOpacity>

        {/* Nếu đang mở CLOTHING thì hiển thị item list */}
        {activeSection === "CLOTHING" && (
          <View style={styles.itemList}>
            {clothingItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.itemRight}>
                  <Text style={styles.itemCount}>{item.count} Items</Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={16}
                    color="#aaa"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ACCESSORIES */}
        <TouchableOpacity
          style={[styles.categoryCard, { backgroundColor: "#a79d9d" }]}
          onPress={() => handleToggle("ACCESSORIES")}
        >
          <Text style={styles.categoryText}>ACCESSORIES</Text>
          <Image
            source={require("@/assets/images/accessori.png")}
            style={styles.categoryImage}
          />
        </TouchableOpacity>

        {activeSection === "ACCESSORIES" && (
          <View style={styles.itemList}>
            {accessorieItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.itemRight}>
                  <Text style={styles.itemCount}>{item.count} Items</Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={16}
                    color="#aaa"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* SHOES */}
        <TouchableOpacity
          style={[styles.categoryCard, { backgroundColor: "#41545e" }]}
          onPress={() => handleToggle("SHOES")}
        >
          <Text style={styles.categoryText}>SHOES</Text>
          <Image
            source={require("@/assets/images/shoe.png")}
            style={styles.categoryImage}
          />
        </TouchableOpacity>

        {activeSection === "SHOES" && (
          <View style={styles.itemList}>
            {shoeItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.itemRight}>
                  <Text style={styles.itemCount}>{item.count} Items</Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={16}
                    color="#aaa"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* COLLECTION */}
        <TouchableOpacity
          style={[styles.categoryCard, { backgroundColor: "#c4b7b7" }]}
          onPress={() => handleToggle("COLLECTION")}
        >
          <Text style={styles.categoryText}>COLLECTION</Text>
          <Image
            source={require("@/assets/images/collection.png")}
            style={styles.categoryImage}
          />
        </TouchableOpacity>

        {activeSection === "COLLECTION" && (
          <View style={styles.itemList}>
            {collectionItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.itemRight}>
                  <Text style={styles.itemCount}>{item.count} Items</Text>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={16}
                    color="#aaa"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9", // nền trắng ngà
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 44,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  searchInput: {
    flex: 1,
    marginLeft: 6,
    color: "#333",
    fontSize: 14,
  },
  filterButton: {
    backgroundColor: "#F9F9F9",
    marginLeft: 10,
    height: 44,
    width: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  categoryCard: {
    borderRadius: 16,
    height: 120,
    marginTop: 20,
    padding: 16,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  categoryText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 15,
    marginTop: 30
  },
  categoryImage: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  itemList: {
    marginTop: 10,
    paddingHorizontal: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.3,
    borderBottomColor: "#ddd",
  },
  itemName: {
    fontSize: 14,
    color: "#333",
    paddingVertical: 5,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemCount: {
    fontSize: 12,
    color: "#999",
    marginRight: 4,
  },
});
