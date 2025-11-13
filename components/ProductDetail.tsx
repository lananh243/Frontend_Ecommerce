import { useEffect, useState } from "react"
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native"
import { ChevronLeft, Heart, ChevronDown } from "lucide-react-native"
import { router } from "expo-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { detailProduct } from "@/services/product"
import { getWishlist } from "@/services/wishlist"
import { Ionicons } from "@expo/vector-icons"
import { useWishlist } from "@/app/hooks/useWishlist"

type ProductDetailProps = {
  productId: number;
  onColorChange?: (color: string) => void;
  onSizeChange?: (size: string) => void;
}

export default function ProductDetail({
  productId,
  onColorChange,
  onSizeChange }: ProductDetailProps) {

  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const { wishlist, addToWishlist, removeFromWishlist, isAdding } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const exists = wishlist?.some((item: any) => item.productId === productId);
    setIsWishlisted(exists);
  }, [wishlist, productId]);


  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  // Chi tiết sản phẩm
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product-detail", productId],
    queryFn: () => detailProduct(Number(productId)),
    enabled: !!productId,
  });

  const sizes = ["S", "M", "L"];

  const colors = [
    { name: "white", hex: "#FFFFFF" },
    { name: "black", hex: "#1A1A1A" },
    { name: "tan", hex: "#D4A574" },
    { name: "pink", hex: "#FFC0CB" },
  ];

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    if (product?.data) {
      const defaultSize = product.data.sizes?.[0] ?? null;
      const defaultColor = product.data.colors?.[0]?.toLowerCase() ?? null;

      setSelectedSize(defaultSize);
      setSelectedColor(defaultColor);

      if (defaultColor) onColorChange?.(defaultColor);
      if (defaultSize) onSizeChange?.(defaultSize);
    }
  }, [product]);


  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );

  if (isError || !product)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Không tải được sản phẩm</Text>
      </View>
    );


  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}
          onPress={toggleWishlist} disabled={isAdding}
        >
          <Ionicons
            name={isWishlisted ? "heart" : "heart-outline"}
            size={28}
            color={isWishlisted ? "red" : "gray"}
          />
        </TouchableOpacity>
      </View>

      {/* Product Image */}
      <View style={styles.productImage}>
        <Image
          source={{ uri: product.data.imageUrl }}
          style={styles.img}
        />
      </View>

      {/* Image Indicators */}
      <View style={styles.indicators}>
        <View style={[styles.dot, { backgroundColor: "#CCCCCC" }]} />
        <View style={[styles.dot, { backgroundColor: "#0A5FCC" }]} />
      </View>

      {/* Product Title and Price */}
      <View style={styles.priceRating}>
        <Text style={styles.title}>{product.data.productName}</Text>
        <Text style={styles.price}>
          {product.data.price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </Text>
      </View>

      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <Text key={i} style={styles.star}>
            ★
          </Text>
        ))}
        <Text style={styles.ratingCount}>(63)</Text>
      </View>

      <View style={styles.sizeContainer}>
        {/* Color Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Color</Text>
          <View style={styles.colorContainer}>
            {colors.map((color) => {
              const isAvailable = product.data.colors?.some(
                (c: string) => c.toLowerCase() === color.name
              );
              return (
                <TouchableOpacity
                  key={color.name}
                  onPress={() => {
                    if (isAvailable) {
                      setSelectedColor(color.name)
                      onColorChange?.(color.name)
                    }
                  }}
                  style={[
                    styles.colorButton,
                    {
                      backgroundColor: color.hex,
                      borderColor: selectedColor === color.name ? "#0A5FCC" : "#CCCCCC",
                      borderWidth: 2,
                      transform: selectedColor === color.name ? [{ scale: 1.1 }] : [{ scale: 1 }],
                      opacity: isAvailable ? 1 : 0.3,
                    },
                  ]}
                />
              );
            })}

          </View>
        </View>

        {/* Size Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Size</Text>
          <View style={styles.sizeButtons}>
            {sizes.map((size) => {
              const isAvailable = product.data.sizes?.includes(size);
              return (
                <TouchableOpacity
                  key={size}
                  onPress={() => {
                    if (isAvailable) {
                      setSelectedSize(size);
                      onSizeChange?.(size)
                    }
                  }}
                  style={[
                    styles.sizeButton,
                    {
                      borderColor: selectedSize === size ? "#515151" : "#CCCCCC",
                      backgroundColor: selectedSize === size ? "#515151" : "transparent",
                      opacity: isAvailable ? 1 : 0.2,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.sizeButtonText,
                      {
                        color: selectedSize === size ? "#FFFFFF" : "#333333",
                      },
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </View>

      {/* Description Collapsible */}
      <View style={styles.borderTop}>
        <TouchableOpacity onPress={() => setDescriptionOpen(!descriptionOpen)} style={styles.collapsible}>
          <Text style={styles.collapsibleLabel}>Description</Text>
          <ChevronDown
            size={16}
            color="#000"
            style={{
              transform: descriptionOpen ? [{ rotate: "180deg" }] : [{ rotate: "0deg" }],
            }}
          />
        </TouchableOpacity>
        {descriptionOpen && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>
              {product.data.description}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  productImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: "#F5F5F5",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
  },
  priceRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  star: {
    color: "#4CAF50",
    fontSize: 18,
  },
  ratingCount: {
    fontSize: 12,
    color: "#999999",
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  colorContainer: {
    flexDirection: "row",
    gap: 12,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  sizeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  sizeGuide: {
    fontSize: 12,
    color: "#999999",
  },
  sizeButtons: {
    flexDirection: "row",
    gap: 8,
  },
  sizeButton: {
    minWidth: 40,
    minHeight: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sizeButtonText: {
    fontWeight: "500",
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    marginBottom: 24,
  },
  collapsible: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  collapsibleLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10
  },
  descriptionContainer: {
    paddingBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: "#555555",
    lineHeight: 21,
  },
  readMore: {
    color: "#0A5FCC",
    fontWeight: "500",
  },
})
