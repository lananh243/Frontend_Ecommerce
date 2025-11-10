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
import { DrawerNavigationProp } from "@react-navigation/drawer";

type RootDrawerParamList = {
  Homepage: undefined;
  Discover: undefined;
};

const HomeScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

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
        <CategorySection />

        {/* 🔹 Banner chính */}
        <BannerCarousel
          data={[
            {
              id: "1",
              uri: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80",
              subtitle: "Autumn Collection",
              titleLines: ["Autumn", "Collection", "2021"],
              layout: "full",
            },
            {
              id: "2",
              uri: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80",
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
          data={[
            {
              productId: "1",
              productName: "White fashion hoodie",
              price: "$29.00",
              imageUrl:
                "https://bizweb.dktcdn.net/100/393/859/products/vn-11134211-7ras8-m0uy3sl4sulpd3-1728395366120.jpg?v=1728395485583",
            },
            {
              productId: "2",
              productName: "Cotton Shirt",
              price: "$30.00",
              imageUrl:
                "https://down-vn.img.susercontent.com/file/vn-11134211-7ras8-m0uy3sl4vnql0d",
            },
          ]}
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
