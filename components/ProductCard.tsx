import { ProductResponse } from "@/types";
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface ProductCardProps {
  item: ProductResponse;
  variant?: "default" | "compact";
}

export default function ProductCard({ item, variant = "default" }: ProductCardProps) {
  if (variant === "compact") {
    // 🟦 Giao diện kiểu Recommended
    return (
      <View style={styles.compactCard}>
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
      </View>
    );
  }

  // 🟩 Giao diện mặc định (Feature Product)
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text numberOfLines={1} style={styles.title}>
        {item.productName}
      </Text>
      <Text style={styles.price}>
        {item.price
          ? `${Number(item.price).toLocaleString("vi-VN")} ₫`
          : "Đang cập nhật"}
      </Text>
    </View>
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
  price: { fontSize: 16, fontWeight: "700", marginTop: 5},

  // 🟦 Compact style (Recommended)
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 10,
    width: 220,
    padding: 8,
    elevation: 1,
    marginTop: 25
  },
  compactImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  compactInfo: { flex: 1 },
  compactTitle: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  compactPrice: { fontSize: 13, fontWeight: "bold", color: "#000" },
});
