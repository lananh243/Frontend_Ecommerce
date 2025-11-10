import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from "react-native"
import { ChevronDown, ShoppingBag } from "lucide-react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "@/services/cart";
import { getAllProduct } from "@/services/product";
import { AddToCartRequest, CartItemType } from "@/types";

type SimilarProductsProps = {
  currentProductId?: number;
  selectedColor?: string;
  selectedSize?: string;
};


export default function SimilarProducts({ 
  currentProductId,
  selectedColor = "default",
  selectedSize = "default" }: SimilarProductsProps) {
  const [userId, setUserId] = useState<number>(0);
  const queryClient = useQueryClient();

  // Lấy userId từ AsyncStorage
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.userId);
      }
    };
    fetchUser();
  }, []);

  // Xử lý thêm giỏ hàng
  const mutation = useMutation({
    mutationFn: (cartItem: AddToCartRequest) => addToCart(userId, cartItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-item", userId] });
      Alert.alert("Thành công", "Sản phẩm đã được thêm vào giỏ hàng!")
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 
        error?.message ||                
        "Không thể thêm vào giỏ hàng";
      Alert.alert("Lỗi", message);
    },
  });

  const handleAddToCart = (productId: number) => {
    if (!userId) {
      Alert.alert("Cảnh báo", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }
    mutation.mutate({ productId, quantity: 1, color: selectedColor, size: selectedSize });
  };

  const [productsOpen, setProductsOpen] = useState(true)

  const products1 = [
    {
      id: 1,
      name: "Rise Crop Hoodie",
      price: "$43.00",
      image: "https://images.unsplash.com/photo-1556821552-7f41c5d440db?w=300&h=300&fit=crop",
      rating: 5,
    },
    {
      id: 2,
      name: "Gym Crop Top",
      price: "$39.99",
      image: "https://images.unsplash.com/photo-1506259926000-85c91f8a66a6?w=300&h=300&fit=crop",
      rating: 5,
    },
    {
      id: 3,
      name: "Sport Sweatshirt",
      price: "$47.99",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
      rating: 5,
    },
    {
      id: 4,
      name: "Active Tank",
      price: "$35.00",
      image: "https://images.unsplash.com/photo-1506629082632-250e5c4d64d7?w=300&h=300&fit=crop",
      rating: 5,
    },
  ]

  const ProductCard = ({ product }: { product: any }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.productImage}>
        <Image source={{ uri: product.image }} style={styles.img} />
      </View>
      <Text style={styles.productName} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.productPrice}>{product.price}</Text>

    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.maxWidth}>
        <TouchableOpacity onPress={() => setProductsOpen(!productsOpen)} style={styles.header}>
          <Text style={styles.headerTitle}>Similar Product</Text>
          <ChevronDown
            size={16}
            color="#000"
            style={{
              transform: productsOpen ? [{ rotate: "180deg" }] : [{ rotate: "0deg" }],
            }}
          />
        </TouchableOpacity>

        {productsOpen && (
          <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
                >
                {products1.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </ScrollView>

        )}
      </View>

      {/* Fixed Add to Cart Button */}
      {currentProductId && (
        <View style={styles.fixedButton}>
          <TouchableOpacity style={styles.addToCartButton} 
            onPress={() => handleAddToCart(currentProductId)}>
            <ShoppingBag size={20} color="#FFFFFF" />
            <Text style={styles.addToCartText}>Add To Cart</Text>
          </TouchableOpacity>
        </View>
      )}
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingBottom: 80,
  },
  maxWidth: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    paddingTop: 24,
  },
  productCard: {
    width: 120, 
    marginRight: 16,
  },
  productImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    paddingVertical: 24,
    paddingHorizontal: 4,
    },
  img: {
    width: "100%",
    height: "100%",
  },
  productName: {
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
  },
  productPrice: {
    color: "#666666",
    fontSize: 12,
    fontWeight: "500",
  },
  fixedButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  addToCartButton: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addToCartText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
})
