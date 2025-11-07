import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// ⭐ Component hiển thị 5 ngôi sao dựa trên rating
const RatingStars = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(
        <Ionicons key={i} name="star" size={14} color="#f5c518" />
      );
    } else if (rating >= i - 0.5) {
      stars.push(
        <Ionicons key={i} name="star-half" size={14} color="#f5c518" />
      );
    } else {
      stars.push(
        <Ionicons key={i} name="star-outline" size={14} color="#f5c518" />
      );
    }
  }
  return <View style={{ flexDirection: "row" }}>{stars}</View>;
};

const products = [
  {
    id: "1",
    name: "Linen Dress",
    price: 52,
    oldPrice: 60,
    rating: 4.1,
    reviews: 54,
    image: "https://i.imgur.com/B2pT4Jt.png",
  },
  {
    id: "2",
    name: "Fitted Waist Dress",
    price: 47.99,
    oldPrice: 58,
    rating: 4.4,
    reviews: 62,
    image: "https://i.imgur.com/yH5H4bP.png",
  },
  {
    id: "3",
    name: "Maxi Dress",
    price: 68,
    rating: 4.5,
    reviews: 101,
    image: "https://i.imgur.com/tAkMSXn.png",
  },
  {
    id: "4",
    name: "Front Tie Mini Dress",
    price: 59,
    rating: 4.2,
    reviews: 58,
    image: "https://i.imgur.com/b3NRbC8.png",
  },
  {
    id: "5",
    name: "Ohara Dress",
    price: 85,
    rating: 4.7,
    reviews: 120,
    image: "https://i.imgur.com/ZKBgUeU.png",
  },
  {
    id: "6",
    name: "Tie Back Knit Dress",
    price: 67,
    rating: 4.6,
    reviews: 109,
    image: "https://i.imgur.com/y3xMBWe.png",
  },
  {
    id: "7",
    name: "Leaves Green Dress",
    price: 64,
    rating: 4.3,
    reviews: 82,
    image: "https://i.imgur.com/L6wIgbt.png",
  },
  {
    id: "8",
    name: "Off Shoulder Dress",
    price: 78.99,
    rating: 4.9,
    reviews: 150,
    image: "https://i.imgur.com/Ln2mukW.png",
  },
];

const FilterProductScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dresses</Text>
      </View>

      {/* Found Results */}
      <View style={styles.filter}>
        <View>
          <Text style={styles.foundText}>Found</Text>
          <Text style={styles.resultText}>152 Results</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filter</Text>
          <Ionicons name="chevron-down" size={14} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Product Grid */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity style={styles.imageContainer} onPress={() => router.push("/search/detailProduct")}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <TouchableOpacity style={styles.heartButton}>
                <Ionicons name="heart-outline" size={18} color="#f06292" />
              </TouchableOpacity>
            </TouchableOpacity>

            <Text style={styles.productName}>{item.name}</Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              {item.oldPrice && (
                <Text style={styles.oldPrice}>${item.oldPrice.toFixed(2)}</Text>
              )}
            </View>

            {/* Rating */}
            <View style={styles.ratingRow}>
              <RatingStars rating={item.rating} />
              <Text style={styles.ratingText}> ({item.reviews})</Text>
            </View>
          </View>
        )}
      />
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
  backButton: {
    marginTop: 8,
    marginBottom: 6,
    width: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
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
    borderColor: "#9c9090ff",
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
  oldPrice: {
    fontSize: 12,
    color: "#aaa",
    textDecorationLine: "line-through",
    marginLeft: 6,
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
});
