import { useWishlist } from "@/app/hooks/useWishlist";
import { getWishlist } from "@/services/wishlist";
import { ProductResponse } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

interface ProductCardProps {
  item: ProductResponse;
  variant?: "default" | "compact";
  onPress?: () => void;
}

export default function ProductCard({ item, variant = "default", onPress }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { wishlist, addToWishlist, removeFromWishlist, isAdding } = useWishlist();

  // Đồng bộ trạng thái yêu thích
  useEffect(() => {
    const exists = wishlist?.some((w: any) => w.productId === item.productId);
    setIsWishlisted(exists);
  }, [wishlist, item.productId]);

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(item.productId);
    } else {
      addToWishlist(item.productId);
    }
  };
  

  if (variant === "compact") {
    return (
      <TouchableOpacity onPress={onPress} style={styles.compactCard}>
        <Image source={{ uri: item.imageUrl }} style={styles.compactImage} />
        <View style={styles.compactInfo}>
          <Text numberOfLines={1} style={styles.compactTitle}>
            {item.productName}
          </Text>
          <Text style={styles.compactPrice}>
            {item.price
              ? `${Number(item.price).toLocaleString("vi-VN")} ₫`
              : "Đang cập nhật"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={{ position: "relative" }}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />

        {/* ❤️ Icon đè lên ảnh */}
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
      <Text numberOfLines={1} style={styles.title}>
        {item.productName}
      </Text>
      <Text style={styles.price}>
        {item.price
          ? `${Number(item.price).toLocaleString("vi-VN")} ₫`
          : "Đang cập nhật"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 130,
    paddingBottom: 10,
  },
  image: { width: "100%", height: 150, borderRadius: 10, marginTop: 30 },
  title: { fontSize: 14, fontWeight: "500", marginTop: 15 },
  price: { fontSize: 16, fontWeight: "700", marginTop: 5 },

  // 🟦 Compact style (Recommended)
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 10,
    width: 240,
    padding: 8,
    elevation: 1,
    marginTop: 25,
  },
  compactImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  compactInfo: { flex: 1, marginLeft: 20 },
  compactTitle: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  compactPrice: { fontSize: 13, fontWeight: "bold", color: "#000" },
  heartButton: {
    position: "absolute",
    top: 40,
    right: 5,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 4,
  },
});
