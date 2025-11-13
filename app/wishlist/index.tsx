import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteWishlist, getWishlist } from "@/services/wishlist";
import { useWishlist } from "../hooks/useWishlist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // khoảng cách đều 2 cột
const BOARD_IMAGE_WIDTH = (width - 48) / 2;

export default function WishlistScreen() {
  const [selectedTab, setSelectedTab] = useState<"all" | "boards">("all");
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem("userInfo");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserId(parsed.userId);
      }
    })();
  }, []);

  // Danh sách wishlist
  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
  });

  // Xóa sản phẩm khỏi wishlist
  const { mutate: removeWishlist } = useMutation({
    mutationFn: (id: number) => deleteWishlist(id),
    onSuccess: () => {
      Alert.alert("Đã xóa", "Đã xóa sản phẩm khỏi wishlist 💔");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: () => {
      Alert.alert("Lỗi", "Không thể xóa khỏi wishlist.");
    },
  });



  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );

  if (!wishlist || wishlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Danh sách yêu thích trống 💔</Text>
      </View>
    );
  }

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <TouchableOpacity style={styles.heart}
        onPress={() => {
          Alert.alert(
            "Xóa sản phẩm?",
            "Bạn có chắc muốn xóa sản phẩm này khỏi wishlist?",
            [
              { text: "Hủy", style: "cancel" },
              { text: "Xóa", style: "destructive", onPress: () => removeWishlist(item.productId) },
            ]
          );
        }}
      >
        <Ionicons name="heart" size={22} color="#F24E1E" />
      </TouchableOpacity>
      <Text style={styles.name}>{item.productName}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>
          {item.price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}</Text>
      </View>
    </View>
  );

  // Layout dạng Board
  const renderBoard = () => (
    <ScrollView contentContainerStyle={styles.boardContainer}>
      {wishlist.map((item: any, index: any) => (
        <Image
          key={item.productId}
          source={{ uri: item.imageUrl }}
          style={[
            styles.boardImage,
            { height: index % 2 === 0 ? 230 : 180 }, // tạo cảm giác lộn xộn tự nhiên
          ]}
        />
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "all" && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab("all")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "all" && styles.tabTextActive,
            ]}
          >
            All items
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === "boards" && styles.tabButtonActive,
          ]}
          onPress={() => setSelectedTab("boards")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "boards" && styles.tabTextActive,
            ]}
          >
            Boards
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nội dung */}
      {selectedTab === "all" ? (
        <FlatList
          data={wishlist}
          renderItem={renderItem}
          numColumns={2}
          keyExtractor={(item) => item.productId}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderBoard()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  tabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    borderColor: "#ccc",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#000",
  },
  tabText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#fff",
  },

  // All Items
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    marginBottom: 20,
    width: CARD_WIDTH,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  heart: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  price: {
    fontWeight: "700",
    fontSize: 14,
  },
  oldPrice: {
    marginLeft: 6,
    textDecorationLine: "line-through",
    color: "#999",
    fontSize: 13,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  stars: {
    color: "#12B76A",
    fontSize: 13,
  },
  reviewText: {
    marginLeft: 4,
    color: "#777",
    fontSize: 12,
  },

  // Boards layout
  boardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  boardImage: {
    width: BOARD_IMAGE_WIDTH,
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },

});
