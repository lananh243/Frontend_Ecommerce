import React from "react";
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

// ⭐ Component hiển thị 5 ngôi sao đánh giá
const RatingStars = ({ rating = 4 }: { rating?: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={rating >= i ? "star" : rating >= i - 0.5 ? "star-half" : "star-outline"}
        size={14}
        color="#f5c518"
      />
    );
  }
  return <View style={{ flexDirection: "row" }}>{stars}</View>;
};

const FilterProductScreen = () => {
  const { q } = useLocalSearchParams<{ q?: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["searchProduct", q],
    queryFn: () => searchProductName(q ?? ""),
    enabled: !!q,
  });

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
          <Text style={styles.resultText}>{data?.data.length} Results</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filter</Text>
          <Ionicons name="chevron-down" size={14} color="#333" />
        </TouchableOpacity>
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

      {/* List sản phẩm */}
      {!isLoading && !isError && (
        <FlatList
          data={data?.data || []}
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
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={() => router.push(`/search/${item.productId}`)}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <TouchableOpacity style={styles.heartButton}>
                  <Ionicons name="heart-outline" size={18} color="#f06292" />
                </TouchableOpacity>
              </TouchableOpacity>

              <Text style={styles.productName}>{item.productName}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.price}>
                  {item.price.toLocaleString("vi-VN")} ₫
                </Text>
              </View>

              <View style={styles.ratingRow}>
                <RatingStars rating={4.5} />
                <Text style={styles.ratingText}>({item.stockQuantity})</Text>
              </View>
            </View>
          )}
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
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: "#ccc",
  },
  filterText: {
    fontSize: 13,
    marginRight: 4,
    color: "#333",
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
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
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
