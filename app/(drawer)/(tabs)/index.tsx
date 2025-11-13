import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CategorySection from "@/components/CategorySection";
import Banner from "@/components/Banner";
import ProductSection from "@/components/ProductSection";
import TopCollectionSection from "@/components/TopCollectionSection";
import BannerCarousel from "@/components/BannerCarousel";
import { getAllProduct } from "@/services/product";
import { useQuery } from "@tanstack/react-query";
import { DrawerActions, useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProduct,
  });


  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Đã xảy ra lỗi khi tải sản phẩm!</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="menu" size={26} color="black" />
        </TouchableOpacity>
        <Text style={styles.logo}>GemStore</Text>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 Categories */}
        {/* <CategorySection /> */}

        {/* 🔹 Banner chính */}
        <BannerCarousel
          data={[
            {
              id: "1",
              uri: "https://lh3.googleusercontent.com/G7Ll7lOnBLcw9KzowNZuExtuyKDZh27SPa9yOW4xPUfbAfI4P6K7M_17fnHnAoeMLF4m62j-LeiGAhSW3AN5R_TPqXde3gea_gnLXLZXxq2Pehw1C5HnzTMLPx4KNiEWuPm9aoMbew=w1000-h937-no",
              subtitle: "Autumn Collection",
              titleLines: ["Autumn", "Collection", "2021"],
              layout: "full",
            },
            {
              id: "2",
              uri: "https://sieuthigiake.com/img/trung-bay-trong-cua-hang-quan-ao-cong-so.jpg",
              subtitle: "Summer Collection",
              titleLines: ["Be Cool", "Be Stylish"],
              layout: "full",
            },
          ]}
        />

        {/* 🔹 Feature Products */}
        <ProductSection
          title="Feature Products"
          data={products?.data}
        />

        {/* 🔹 New Collection Banner */}
        <Banner
          uri= {require('@/assets/images/download.png')}
          subtitle="New Collection"
          titleLines={["Hang Out", "& Party"]}
        />

        {/* 🔹 Recommended */}
        <ProductSection
          title="Recommended"
          horizontal={true}
          cardStyle="compact"
          data={products?.data}
        />

        {/* 🔹 Top Collection */}
        <TopCollectionSection />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  logo: { fontSize: 20, fontWeight: "bold" },
});