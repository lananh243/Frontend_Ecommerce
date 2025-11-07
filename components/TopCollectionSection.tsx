import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const collections = [
  {
    id: "1",
    title: "FOR SLIM & BEAUTY",
    subtitle: "Sale up to 40%",
    image: require('@/assets/images/yellow-dress.png'),
    bgColor: "#f5f4f9",
  },
  {
    id: "2",
    title: "Most sexy & fabulous design",
    subtitle: "Summer Collection 2021",
    image: require('@/assets/images/brown.png'),
    bgColor: "#f7f7f7",
  },
  {
    id: "3",
    title: "The Office Life",
    subtitle: "T-Shirts",
    image: require('@/assets/images/P-white.png'),
    bgColor: "#f9f9f9",
  },
  {
    id: "4",
    title: "Elegant Design",
    subtitle: "Dresses",
    image: require('@/assets/images/D-white.png'),
    bgColor: "#f9f9f9",
  },
];

export default function TopCollectionSection() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Top Collection</Text>
        <TouchableOpacity>
          <Text style={styles.showAll}>Show all</Text>
        </TouchableOpacity>
      </View>

      {/* Large card */}
      <TouchableOpacity style={[styles.card, { backgroundColor: collections[0].bgColor }]}>
        <View style={styles.cardText}>
          <Text style={styles.subtitle}>| {collections[0].subtitle}</Text>
          <Text style={styles.largeTitle}>{collections[0].title}</Text>
        </View>
        <Image source={
          typeof collections[0].image === "string"
            ? { uri: collections[0].image } 
            : collections[0].image  
        } style={styles.imageLarge} />
      </TouchableOpacity>

      {/* Medium card */}
      <TouchableOpacity style={[styles.card, { backgroundColor: collections[1].bgColor }]}>
        <View style={styles.cardText}>
          <Text style={styles.subtitle}>| {collections[1].subtitle}</Text>
          <Text style={styles.mediumTitle}>{collections[1].title}</Text>
        </View>
        <Image source={
          typeof collections[1].image === "string"
            ? { uri: collections[1].image } 
            : collections[1].image
        } style={styles.imageMedium} />
      </TouchableOpacity>

      {/* Grid row (two small cards) */}
      <View style={styles.gridRow}>
        {collections.slice(2).map((item) => (
          <TouchableOpacity key={item.id} style={styles.smallCard}>
            <View style={styles.smallTextBox}>
              <Text style={styles.smallSubtitle}>{item.subtitle}</Text>
              <Text style={styles.smallTitle}>{item.title}</Text>
            </View>
            <Image
              source={typeof item.image === "string" ? { uri: item.image } : item.image}
              style={styles.sideImage}
            />

          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 80,
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  showAll: {
    fontSize: 13,
    color: "#999",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 14,
    marginHorizontal: 16,
    padding: 20,
    marginTop: 12,
    overflow: "hidden",
    alignItems: "center",
  },
  cardText: {
    flex: 1,
    paddingRight: 10,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 6,
  },
  largeTitle: {
    fontSize: 22,
    fontWeight: "400",
    color: "#838a92ff",
  },
  mediumTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
  },
  imageLarge: {
    width: 105,
    height: 130,
    borderRadius: 12,
  },
  imageMedium: {
    width: 155,
    height: 180,
    borderRadius: 12,
  },
  // Small Cards (Horizontal layout)
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 14,
  },
  smallCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 14,
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    height: 220,
  },
  smallTextBox: {
    flex: 1,
    paddingRight: 4,
  },
  smallSubtitle: {
    color: "#9a9a9a",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
  },
  smallTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    lineHeight: 18,
  },
  sideImage: {
    width: 75,
    height: 160,
    resizeMode: "cover",
    borderRadius: 10,
  },
});
