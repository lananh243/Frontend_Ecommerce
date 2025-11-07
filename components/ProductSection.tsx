import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ProductCard from "./ProductCard";
import { ProductResponse } from "@/types";

interface ProductSectionProps {
  title: string;
  data?: ProductResponse[];
  horizontal?: boolean;
  cardStyle?: "default" | "compact";
}

export default function ProductSection({
  title,
  data,
  horizontal = true,
  cardStyle = "default",
}: ProductSectionProps) {
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.showAll}>Show all</Text>
      </View>

      <FlatList
        data={data}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={({ item }) => <ProductCard item={item} variant={cardStyle} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có sản phẩm nào</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 30,
  },
  title: { fontSize: 19, fontWeight: "bold" },
  showAll: { fontSize: 12, color: "#999" },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 14,
  },
});
