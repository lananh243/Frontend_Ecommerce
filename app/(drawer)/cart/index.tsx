import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartItemType } from "@/types";
import { ActivityIndicator } from "react-native-paper";
import { clearCart, deleteCartItemId, getAllCart, updateQuantityCart } from "@/services/cart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';


const CartScreen = () => {
  const [userId, setUserId] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
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

  
  const {data: cartItemsFromServer, isLoading, isError, refetch} = useQuery({
    queryKey: ["cart-item", userId],
    queryFn: () => getAllCart(userId),
    enabled: !!userId,
  })

  // Đồng bộ state khi fetch xong
  useEffect(() => {
    if (cartItemsFromServer?.data) {
      setCartItems((prev) => {
        // Lưu trạng thái checked cũ (theo cartItemId)
        const checkedMap = new Map(prev.map((i) => [i.cartItemId, i.checked]));

        // Khi dữ liệu mới về, giữ lại checked nếu có
        return cartItemsFromServer.data.map((item: CartItemType) => ({
          ...item,
          checked: checkedMap.get(item.cartItemId) ?? false,
        }));
      });
    }
  }, [cartItemsFromServer]);


  const updateQuantityMutation = useMutation({
  mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
    updateQuantityCart(cartItemId, quantity),
    onSuccess: () => {
      // Cập nhật lại giỏ hàng sau khi cập nhật thành công
      queryClient.invalidateQueries({ queryKey: ["cart-item", userId] });
    },
    onError: (error) => {
      console.log("Lỗi cập nhật giỏ hàng:", error);
    },
});

  const subtotal = cartItems
  .filter((item) => item.checked)
  .reduce((sum, item) => {
    const price = Number(item.product?.price) || 0; 
    return sum + price * item.quantity;
  }, 0);


  const toggleCheck = (cartItemId: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  };

  // Xóa sản phẩm theo Id
  const deleteMutation = useMutation({
    mutationFn: (cartItemId: number) => deleteCartItemId(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-item", userId] });
    },
    onError: (error) => {
      console.log("Lỗi xóa sản phẩm:", error);
    },
  });

  // Xóa tất cả sản phẩm
  const clearMutation = useMutation({
    mutationFn: (userId: number) => clearCart(userId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["cart-item", userId] });
    },
    onError: () => {
      Alert.alert("Lỗi", "Không thể xóa tất cả sản phẩm");
    },
  })


  if (isLoading)
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      );
  
    if (isError)
      return (
        <View style={styles.center}>
          <Text style={{ color: "red" }}>Không tải được sản phẩm</Text>
        </View>
      );

    if (!isLoading && (cartItemsFromServer?.data?.length || 0) === 0) {
      return (
        <View style={styles.center}>
          <Text>Giỏ hàng trống</Text>
        </View>
      );
    }

  const changeQuantity = (cartItemId: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const newQuantity = Math.max(1, item.quantity + delta);

          updateQuantityMutation.mutate({cartItemId, quantity: newQuantity});

          return { ...item, quantity: newQuantity};
        }
        return item;
      })
    );
  };

  const renderRightActions = (cartItemId: number) => {

    const handleDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => deleteMutation.mutate(cartItemId),
        },
      ]
    );
  };
  
  return (
    <TouchableOpacity
      onPress={handleDelete}
      style={{
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        borderRadius: 12,
        marginRight: 15,
        marginVertical: 6,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Delete</Text>
    </TouchableOpacity>
  );
};

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={22} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <TouchableOpacity
          disabled={!userId}
          onPress={() => {
            Alert.alert(
              "Xác nhận xóa tất cả",
              "Bạn có chắc muốn xóa toàn bộ sản phẩm trong giỏ hàng?",
              [
                { text: "Hủy", style: "cancel" },
                { text: "Xóa tất cả", style: "destructive", onPress: () => clearMutation.mutate(userId)},
              ]
            );
          }}
        >
          <Text style={{ color: "red", fontWeight: "600" }}>Delete All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <Swipeable key={item.cartItemId} renderRightActions={() => renderRightActions(item.cartItemId)}>
              <View style={styles.card}>
                <Image source={{ uri: item.product.imageUrl }} style={styles.image} />
                <View style={styles.info}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={styles.name}>{item.product.productName}</Text>
                    <TouchableOpacity onPress={() => toggleCheck(item.cartItemId)}>
                      <Ionicons
                        name={
                          item.checked ? "checkmark-circle" : "ellipse-outline"
                        }
                        size={22}
                        color={item.checked ? "#00C897" : "#ccc"}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.price}>{(Number(item.product?.price) || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</Text>
                  <View>

                  </View>
                  <Text style={styles.details}>
                    Size: {item.size} | Color: {item.color}
                  </Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      onPress={() => changeQuantity(item.cartItemId, -1)}
                      style={styles.qtyBtn}
                    >
                      <Text style={styles.qtyText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyNumber}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => changeQuantity(item.cartItemId, 1)}
                      style={styles.qtyBtn}
                    >
                      <Text style={styles.qtyText}>+</Text>
                    </TouchableOpacity>
                </View>
              </View>
          </View>
          </Swipeable>
          
        ))}
      </ScrollView>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.row}>
          <Text style={styles.label}>Product price</Text>
          <Text style={styles.value}>{subtotal.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</Text>
        </View>
        <View style={styles.row1}>
          <Text style={styles.label}>Shipping</Text>
          <Text style={[styles.value, { color: "#00C897" }]}>Freeship</Text>
        </View>
        <View style={styles.row1}>
          <Text style={[styles.label, { fontWeight: "700" }]}>Subtotal</Text>
          <Text style={styles.total}>{subtotal.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.push("/cart/shipping")}>
          <Text style={styles.checkoutText}>Proceed to checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </GestureHandlerRootView>
    
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 110,
    height: 'auto',
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontWeight: "600",
    fontSize: 15,
  },
  price: {
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 4,
  },
  details: {
    color: "#777",
    fontSize: 13,
    marginVertical: 2,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    width: 90,
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  qtyBtn: {
    paddingHorizontal: 4,
  },
  qtyText: {
    fontSize: 18,
  },
  qtyNumber: {
    fontSize: 15,
    fontWeight: "500",
  },
  summary: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
    padding: 10
    
  },
  row1: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
    borderTopWidth: 1,
    borderColor: "#eee",
    padding: 15
  },
  label: {
    color: "#555",
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
  },
  total: {
    fontWeight: "700",
    fontSize: 16,
  },
  checkoutBtn: {
    backgroundColor: "#000",
    borderRadius: 25,
    paddingVertical: 14,
    marginTop: 15,
  },
  checkoutText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
});
