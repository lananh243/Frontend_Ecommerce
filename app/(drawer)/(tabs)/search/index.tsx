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
import { router, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories, searchCategory, sortCategory } from "@/services/category";

const DiscoverScreen = () => {
  const navigation = useNavigation();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [sortVisible, setSortVisible] = useState(false); // 🔽 Hiển thị menu sort
  const [sortOrder, setSortOrder] = useState<string>("asc"); // "asc" hoặc "desc"

  // 🧩 Query mặc định: lấy toàn bộ danh mục
  const { data: categories, isLoading, isError, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
  });

  // 🔍 Tìm kiếm danh mục theo tên
  const { data: searchedCategories } = useQuery({
    queryKey: ["categories", searchText],
    queryFn: () => searchCategory(searchText),
    enabled: searchText.trim().length > 0,
  });

  
  // 🔁 Sắp xếp danh mục (asc/desc)
  const { data: sortedCategories } = useQuery({
    queryKey: ["categories-sort", sortOrder],
    queryFn: () => sortCategory(sortOrder),
    enabled: !!sortOrder,
  });

  // ✅ Dữ liệu hiển thị: ưu tiên tìm kiếm → sắp xếp → mặc định
  const displayedCategories =
    searchText.trim().length > 0
      ? searchedCategories?.data || []
      : sortVisible
      ? sortedCategories?.data || []
      : categories;

  const handleToggle = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleSortToggle = () => {
    setSortVisible(!sortVisible);
  };

  const handleSelectSort = (order: string) => {
    setSortOrder(order);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="menu-outline"
          size={26}
          color="#000"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
        <Text style={styles.title}>Discover</Text>
        <Ionicons name="notifications-outline" size={26} color="#000" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <TouchableOpacity style={styles.searchContainer} onPress={() => router.push("/search/find")}>
            <Ionicons name="search-outline" size={18} color="#8C8C8C" />
            <TextInput
              placeholder="Search category..."
              placeholderTextColor="#8C8C8C"
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
          </TouchableOpacity>

          {/* Nút Sort */}
          <TouchableOpacity style={styles.filterButton} onPress={handleSortToggle}>
            <Ionicons name="options-outline" size={18} color="#8C8C8C" />
          </TouchableOpacity>
        </View>

        {/* Popup chọn ASC / DESC */}
        {sortVisible && (
          <View style={styles.sortDropdown}>
            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => handleSelectSort("asc")}
            >
              <Text
                style={[
                  styles.sortText,
                  sortOrder === "asc" && styles.sortActiveText,
                ]}
              >
                🔼 ASC (A → Z)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => handleSelectSort("desc")}
            >
              <Text
                style={[
                  styles.sortText,
                  sortOrder === "desc" && styles.sortActiveText,
                ]}
              >
                🔽 DESC (Z → A)
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Danh mục */}
        {!isLoading && !isError && displayedCategories?.length > 0 ? (
          displayedCategories.map((cat: any) => (
            <View key={cat.categoryId}>
              <TouchableOpacity
                style={[styles.categoryCard, { backgroundColor: "#b0b2aa" }]}
                onPress={() => handleToggle(cat.categoryId)}
              >
                <Text style={styles.categoryText}>{cat.categoryName}</Text>
                <Image
                  source={{ uri: cat.imageUrl }}
                  style={styles.categoryImage}
                />
              </TouchableOpacity>

              {activeSection === cat.categoryId && cat.products?.length > 0 && (
                <View style={styles.itemList}>
                  {cat.products.map((product: any) => (
                    <TouchableOpacity
                      key={product.productId}
                      style={styles.itemRow}
                      onPress={() =>
                        router.push(`/search/${product.productId}`)
                      }
                    >
                      <Text style={styles.itemName}>{product.productName}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
            {isLoading
              ? "Đang tải dữ liệu..."
              : "Không tìm thấy danh mục nào."}
          </Text>
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
    backgroundColor: "#F9F9F9",
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
  sortDropdown: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 10,
    marginHorizontal: 10,
    padding: 10,
    elevation: 2,
  },
  sortOption: {
    paddingVertical: 8,
  },
  sortText: {
    fontSize: 14,
    color: "#333",
  },
  sortActiveText: {
    color: "#007AFF",
    fontWeight: "bold",
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
    marginTop: 30,
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
});
