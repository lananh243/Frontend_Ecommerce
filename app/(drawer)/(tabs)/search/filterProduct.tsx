import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { searchProductName } from "@/services/product";
import { useWishlist } from "@/app/hooks/useWishlist";

const FilterProductScreen = () => {
  const { wishlist, addToWishlist, removeFromWishlist, isAdding } = useWishlist();
  const { q } = useLocalSearchParams<{ q?: string }>();

  // 🔍 Lấy danh sách sản phẩm theo tên
  const { data, isLoading, isError } = useQuery({
    queryKey: ["searchProduct", q],
    queryFn: () => searchProductName(q ?? ""),
    enabled: !!q,
  });

  const products = data?.data || [];

  // 🧠 Hàm kiểm tra sản phẩm đã có trong wishlist hay chưa
  const checkWishlisted = (productId: number) => {
    return wishlist?.some((item: any) => item.productId === productId);
  };

  // 🧩 Toggle wishlist cho từng sản phẩm
  const toggleWishlist = (productId: number) => {
    const exists = checkWishlisted(productId);
    if (exists) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{q}</Text>
      </View>

      {/* Found results */}
      <View style={styles.filter}>
        <View>
          <Text style={styles.foundText}>Found</Text>
          <Text style={styles.resultText}>{products.length} Results</Text>
        </View>
      </View>

      {/* Loading */}
      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}

      {/* Error */}
      {isError && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Lỗi khi tải dữ liệu!</Text>
        </View>
      )}

      {/* Danh sách sản phẩm */}
      {!isLoading && !isError && (
        <FlatList
          data={products}
          keyExtractor={(item) => item.productId.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.notFound}>Không tìm thấy sản phẩm</Text>
            </View>
          }
          renderItem={({ item }) => {
            const isWishlisted = checkWishlisted(item.productId);
            return (
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.imageContainer}
                  onPress={() => router.push(`/search/${item.productId}`)}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.heartButton}
                    onPress={() => toggleWishlist(item.productId)}
                    disabled={isAdding}
                  >
                    <Ionicons
                      name={isWishlisted ? "heart" : "heart-outline"}
                      size={18}
                      color={isWishlisted ? "red" : "gray"}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>

                <Text style={styles.productName}>{item.productName}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.price}>
                    {item.price.toLocaleString("vi-VN")} ₫
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default FilterProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  foundText: {
    color: "#777",
    fontSize: 14,
    marginTop: 8,
  },
  resultText: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 12,
  },
  card: {
    width: "48%",
    marginBottom: 20,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    marginTop: 18,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
  },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 6,
  },
  productName: {
    fontSize: 13,
    color: "#333",
    marginTop: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  notFound: {
    fontSize: 16,
    textAlign: "center",
    color: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
