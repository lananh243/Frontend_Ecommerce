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
import { router, useFocusEffect, useNavigation } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartItemType } from "@/types";
import { ActivityIndicator } from "react-native-paper";
import { clearCart, deleteCartItemId, getCartById, updateQuantityCart } from "@/services/cart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { DrawerActions } from "@react-navigation/native";

const CartScreen = () => {
  const [userId, setUserId] = useState<number>(0);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  const queryClient = useQueryClient();

  // Lấy userId từ AsyncStorage
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("userInfo");
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.userId);
      }
    };
    fetchUser();
  }, []);

  const { data: cartItemsFromServer, isLoading } = useQuery({
    queryKey: ["cart-item", userId],
    queryFn: () => getCartById(userId),
    enabled: !!userId,
  });

  // Đồng bộ state khi fetch xong
  useEffect(() => {
    if (cartItemsFromServer?.data) {
      setCartItems(cartItemsFromServer.data);
    }
  }, [cartItemsFromServer]);

  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      updateQuantityCart(cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-item", userId] });
    },
    onError: (error) => {
      console.log("Lỗi cập nhật giỏ hàng:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (cartItemId: number) => deleteCartItemId(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-item", userId] });
    },
    onError: (error) => {
      console.log("Lỗi xóa sản phẩm:", error);
    },
  });

  const clearMutation = useMutation({
    mutationFn: (userId: number) => clearCart(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-item", userId] });
    },
    onError: () => {
      Alert.alert("Lỗi", "Không thể xóa tất cả sản phẩm");
    },
  });

  const navigation = useNavigation();

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );

  if (!isLoading && (cartItemsFromServer?.data?.length || 0) === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={90} color="#ccc" />
        <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
        <TouchableOpacity
          style={styles.shopNowBtn}
          onPress={() => router.push("/")}
        >
          <Text style={styles.shopNowText}>🛍️ Tiếp tục mua sắm</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const changeQuantity = (cartItemId: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          updateQuantityMutation.mutate({ cartItemId, quantity: newQuantity });
          return { ...item, quantity: newQuantity };
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
          { text: "Hủy", style: "cancel" },
          { text: "Xóa", style: "destructive", onPress: () => deleteMutation.mutate(cartItemId) },
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

  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.product?.price) || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu-outline" size={26} color="#000" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
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
                  { text: "Xóa tất cả", style: "destructive", onPress: () => clearMutation.mutate(userId) },
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
                  <Text style={styles.name}>{item.product.productName}</Text>
                  <Text style={styles.price}>{(Number(item.product?.price) || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</Text>
                  <Text style={styles.details}>Size: {item.size} | Color: {item.color}</Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => changeQuantity(item.cartItemId, -1)} style={styles.qtyBtn}>
                      <Text style={styles.qtyText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyNumber}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => changeQuantity(item.cartItemId, 1)} style={styles.qtyBtn}>
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

          <TouchableOpacity style={styles.checkoutBtn}
            onPress={() => {
              router.push({
                pathname: "/cart/check_out/shipping",
                params: {
                  orderItems: JSON.stringify(cartItems.map(item => ({
                    productId: item.product.productId,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size,
                  }))),
                  subtotal: subtotal.toString(),
                },
              });
            }}>
            <Text style={styles.checkoutText}>Proceed to checkout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default CartScreen;

// --- styles giữ nguyên ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 10 },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  card: { flexDirection: "row", backgroundColor: "#fff", marginHorizontal: 16, marginVertical: 6, borderRadius: 12, padding: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  image: { width: 110, height: 'auto', borderRadius: 10 },
  info: { flex: 1, marginLeft: 10 },
  name: { fontWeight: "600", fontSize: 15 },
  price: { fontWeight: "bold", fontSize: 14, marginTop: 4 },
  details: { color: "#777", fontSize: 13, marginVertical: 2 },
  quantityContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 8, width: 90, justifyContent: "space-between", paddingHorizontal: 8, paddingVertical: 3, marginTop: 6 },
  qtyBtn: { paddingHorizontal: 4 },
  qtyText: { fontSize: 18 },
  qtyNumber: { fontSize: 15, fontWeight: "500" },
  summary: { backgroundColor: "#fff", borderTopWidth: 1, borderColor: "#eee", padding: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 3, padding: 10 },
  row1: { flexDirection: "row", justifyContent: "space-between", marginVertical: 3, borderTopWidth: 1, borderColor: "#eee", padding: 15 },
  label: { color: "#555", fontSize: 14 },
  value: { fontSize: 14, fontWeight: "500" },
  total: { fontWeight: "700", fontSize: 16 },
  checkoutBtn: { backgroundColor: "#000", borderRadius: 25, paddingVertical: 14, marginTop: 15 },
  checkoutText: { color: "#fff", textAlign: "center", fontSize: 15, fontWeight: "600" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 20 },
  emptyText: { fontSize: 16, color: "#888", marginTop: 15, textAlign: "center" },
  shopNowBtn: { marginTop: 25, backgroundColor: "#ff3b30", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  shopNowText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
