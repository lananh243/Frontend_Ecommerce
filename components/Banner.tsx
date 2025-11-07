import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface BannerProps {
  uri: string;
  subtitle?: string;
  titleLines?: string[];
}

export default function Banner({
  uri,
  subtitle = "New Collection",
  titleLines = ["Hang Out", "& Party"],
}: BannerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        {/* Text bên trái */}
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>| {subtitle}</Text>
          {titleLines.map((line, index) => (
            <Text key={index} style={styles.title}>
              {line}
            </Text>
          ))}
        </View>

        {/* Ảnh bên phải */}
        <View style={styles.imageContainer}>
          <View style={styles.circleBehind} />
          <Image source={typeof uri === "string" ? {uri} : uri} style={styles.image} resizeMode="contain" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 15 },
  banner: {
    width: width * 0.9,
    height: 180,
    alignSelf: "center",
    backgroundColor: "#f6f7fb",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  textContainer: { flex: 1 },
  subtitle: {
    color: "#999",
    fontSize: 13,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: { color: "#000", fontSize: 22, fontWeight: "600", lineHeight: 28 },
  imageContainer: {
    position: "relative",
    width: 160,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  circleBehind: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#e9e9ef",
  },
  image: { width: 160, height: "100%" },
});
