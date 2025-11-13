import React, { useEffect, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage"; // ✅ thêm
import { searchProductName } from "@/services/product";

const STORAGE_KEY = "recentSearches";

const SearchScreen = () => {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // ✅ Load lịch sử tìm kiếm khi mở lại trang
  useEffect(() => {
    const loadHistory = async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setRecentSearches(JSON.parse(saved));
    };
    loadHistory();
  }, []);

  // ✅ Debounce search keyword
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [keyword]);

  

  // ✅ Lưu lịch sử tìm kiếm vào AsyncStorage
  useEffect(() => {
    if (debouncedKeyword) {
      setRecentSearches((prev) => {
        const newHistory = [
          debouncedKeyword,
          ...prev.filter((k) => k !== debouncedKeyword),
        ].slice(0, 10);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
        return newHistory;
      });
    }
  }, [debouncedKeyword]);

  // ✅ Xóa toàn bộ lịch sử
  const handleClearHistory = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setRecentSearches([]);
  };

  // ✅ Xóa từng item
  const handleRemoveHistoryItem = async (keyword: string) => {
    const newHistory = recentSearches.filter((item) => item !== keyword);
    setRecentSearches(newHistory);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  // Chọn lại từ khóa cũ để tìm
  const handleSearchSelect = (value: string) => {
    setKeyword(value);
    setDebouncedKeyword(value);
  };

  const handleSearch = () => {
    if (!keyword.trim()) return;
    router.push({
      pathname: "/search/filterProduct",
      params: { q : keyword}
    })
  }

  const popularItems = [
    {
      name: "Lihua Tunic White",
      price: 53.0,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSho9hfocNua9zLkdfQAVl126FCcEwb0NzyQ&s",
    },
    {
      name: "Skirt Dress",
      price: 34.0,
      image:
        "https://file.hstatic.net/1000197303/file/chan_vay_xep_ly_-_item_khong_the_thieu_cua_cac_co_nang_282f3eedce694697af6d064d5aebb45c_grande.png",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back-outline" size={22} color="#000" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <TouchableOpacity style={styles.searchContainer} onPress={() => handleSearch()}>
            <Ionicons name="search-outline" size={18} color="#8C8C8C" />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#8C8C8C"
              style={styles.searchInput}
              value={keyword}
              onChangeText={setKeyword}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={18} color="#8C8C8C" />
          </TouchableOpacity>
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={handleClearHistory}>
                <Ionicons name="trash-outline" size={18} color="#8C8C8C" />
              </TouchableOpacity>
            </View>

            <View style={styles.tagContainer}>
              {recentSearches.map((item, index) => (
                <View key={index} style={styles.tag}>
                  <TouchableOpacity onPress={() => handleSearchSelect(item)}>
                    <Text style={styles.tagText}>{item}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemoveHistoryItem(item)}>
                    <Ionicons name="close-outline" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Popular this week */}
        <View style={styles.popularSection}>
          <View style={styles.popularHeader}>
            <Text style={styles.popularTitle}>Popular this week</Text>
            <Text style={styles.showAll}>Show all</Text>
          </View>

          <View style={styles.productContainer}>
            {popularItems.map((item, index) => (
              <View key={index} style={styles.productCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>
                  ${item.price.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  backButton: { marginTop: 8, marginBottom: 6, width: 30 },
  searchWrapper: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 44,
  },
  searchInput: { flex: 1, marginLeft: 6, color: "#333", fontSize: 14 },
  filterButton: {
    backgroundColor: "#F9F9F9",
    marginLeft: 10,
    height: 44,
    width: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  recentSection: { marginTop: 20 },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recentTitle: { fontSize: 15, color: "gray", fontWeight: "500" },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 25,
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  tagText: { color: "#333", fontSize: 13, marginRight: 4 },
  popularSection: { marginTop: 30 },
  popularHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  popularTitle: { fontWeight: "700", fontSize: 16, color: "#000" },
  showAll: { color: "#555", fontSize: 13 },
  productContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  productCard: { width: "45%" },
  productImage: {
    width: "100%",
    height: 190,
    borderRadius: 12,
    resizeMode: "cover",
  },
  productName: { fontSize: 14, color: "#333", marginTop: 8 },
  productPrice: { fontWeight: "600", marginTop: 5, color: "#000" },
});
