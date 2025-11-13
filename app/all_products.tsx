import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { getAllProduct } from "@/services/product";
import { useRouter } from "expo-router";
import FilterModal from "@/components/FilterModal";
import { useWishlist } from "./hooks/useWishlist";

const ShowAllProductsScreen = () => {
  const router = useRouter();
  const [filterVisible, setFilterVisible] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]); 

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["allProducts"],
    queryFn: getAllProduct,
  });

  // Nhận kết quả lọc từ FilterModal
  const handleApplyFilters = (data: any[]) => {
    setFilteredProducts(data); // cập nhật danh sách hiển thị
  };

  // Chọn nguồn dữ liệu hiển thị
  const displayedProducts =
    filteredProducts.length > 0 ? filteredProducts : products?.data || [];

      const { wishlist, addToWishlist, removeFromWishlist, isAdding } = useWishlist();
    

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Không thể tải danh sách sản phẩm!</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Tất cả sản phẩm</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Ionicons name="options-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Grid sản phẩm */}
      {displayedProducts.length === 0 ? (
        <View style={styles.center}>
          <Text>Không có sản phẩm nào phù hợp!</Text>
        </View>
      ) : (
        <FlatList
          data={displayedProducts}
          numColumns={2}
          keyExtractor={(item) => item.productId.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productList}
          renderItem={({ item }) => {
            // ✅ Kiểm tra sản phẩm có trong wishlist hay không
            const isWishlisted = wishlist?.some(
              (w: any) => w.productId === item.productId
            );

            // ✅ Bật/tắt wishlist
            const toggleWishlist = () => {
              if (isWishlisted) {
                removeFromWishlist(item.productId);
              } else {
                addToWishlist(item.productId);
              }
            };

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/search/${item.productId}`)}
              >
                <View style={{ position: "relative" }}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                  />

                  {/* ❤️ Icon yêu thích */}
                  <TouchableOpacity
                    style={styles.heartButton}
                    onPress={toggleWishlist}
                    disabled={isAdding}
                  >
                    <Ionicons
                      name={isWishlisted ? "heart" : "heart-outline"}
                      size={22}
                      color={isWishlisted ? "#F24E1E" : "gray"}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.name} numberOfLines={2}>
                  {item.productName}
                </Text>
                <Text style={styles.price}>
                  {item.price
                    ? `${Number(item.price).toLocaleString("vi-VN")} ₫`
                    : "Đang cập nhật"}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Modal lọc */}
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApplyFilters={handleApplyFilters} // ✅ truyền callback
      />
    </SafeAreaView>
  );
};

export default ShowAllProductsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 18, fontWeight: "600", color: "#000" },
  productList: {
    paddingHorizontal: 10,
    paddingBottom: 100,
    marginTop: 20,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: { width: "100%", height: 150, borderRadius: 10, marginBottom: 8 },
  name: { fontSize: 14, fontWeight: "500", color: "#333" },
  price: { fontSize: 15, fontWeight: "bold", color: "#000", marginTop: 4 },
  heartButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 4,
  },
});
