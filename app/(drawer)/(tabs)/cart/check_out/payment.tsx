import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrderLastest } from "@/services/order";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearAfterPayment, clearCart } from "@/services/cart";

const PaymentScreen = () => {
  const [method, setMethod] = useState("card");
  const [agree, setAgree] = useState(false);

  const [user, setUser] = useState<{ userId: number; email: string } | null>(
    null
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("userInfo");
      if (userData) {
        const parsed = JSON.parse(userData);
        setUser({ userId: parsed.userId, email: parsed.email });
      }
    };
    fetchUser();
  }, []);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["latestOrder", user?.email],
    queryFn: () => getOrderLastest(user?.email ?? ""),
    enabled: !!user?.email,
  });

  // 🔹 Mutation để clear cart sau thanh toán
  const clearCartMutation = useMutation({
    mutationFn: () => clearCart(user?.userId ?? 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-item", user?.userId] });
      // Chuyển đến trang order completed
      router.push("/cart/check_out/order_completed");

    },
    onError: (error: any) => {
      Alert.alert("Lỗi", "Không thể xóa giỏ hàng. Vui lòng thử lại.");
    },
  });

  // 🔹 Xử lý khi nhấn "Place my order"
  const handlePlaceOrder = () => {
    if (!agree) {
      Alert.alert("Thông báo", "Vui lòng đồng ý với điều khoản và điều kiện");
      return;
    }
    if (!user) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng.");
      return;
    }

    // Gọi API xóa giỏ hàng
    clearCartMutation.mutate();
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading latest order...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Error: {(error as any).message}</Text>
        <Text onPress={() => refetch()} style={{ color: "blue", marginTop: 8 }}>
          Try again
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={22} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check out</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <FontAwesome6 name="location-dot" size={24} color="black" />
        <View style={styles.progressLine} />
        <MaterialIcons name="payment" size={24} color="black" />
        <View style={styles.progressLine} />
        <Ionicons name="checkmark-circle" size={24} color="#ccc" />
      </View>

      <Text style={styles.stepText}>STEP 2</Text>
      <Text style={styles.title}>Payment</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Payment method buttons */}
        <View style={styles.methodRow}>
          <TouchableOpacity
            style={[
              styles.methodBox,
              method === "cash" && styles.methodActive,
            ]}
            onPress={() => setMethod("cash")}
          >
            <Ionicons name="cash-outline" size={28} color="#333" />
            <Text style={styles.methodText}>Cash</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodBox,
              method === "card" && styles.methodActive,
            ]}
            onPress={() => setMethod("card")}
          >
            <Ionicons name="card-outline" size={28} color="#333" />
            <Text style={styles.methodText}>Credit Card</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodBox,
              method === "other" && styles.methodActive,
            ]}
            onPress={() => setMethod("other")}
          >
            <Ionicons name="ellipsis-horizontal" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Choose card */}
        <View style={styles.chooseRow}>
          <Text style={styles.chooseTitle}>Choose your card</Text>
          <TouchableOpacity>
            <Text style={styles.addNew}>Add new +</Text>
          </TouchableOpacity>
        </View>

        {/* Visa card preview */}
        <View style={styles.cardBox}>
          <View style={styles.cardTop}>
            <Text style={styles.cardBrand}>VISA</Text>
          </View>
          <Text style={styles.cardNumber}>4364 1345 8932 8378</Text>
          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.cardLabel}>CARDHOLDER NAME</Text>
              <Text style={styles.cardValue}>Sunie Pham</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>VALID THRU</Text>
              <Text style={styles.cardValue}>05/24</Text>
            </View>
          </View>
        </View>

        {/* Other payment icons */}
        <Text style={[styles.orText, { marginTop: 20 }]}>
          or check out with
        </Text>
        <View style={styles.payIcons}>
          {[
            "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
            "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
            "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
            "https://upload.wikimedia.org/wikipedia/commons/2/2d/Alipay_logo.svg",
            "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg",
          ].map((url, i) => (
            <Image
              key={i}
              source={{ uri: url }}
              style={{
                width: 50,
                height: 30,
                resizeMode: "contain",
              }}
            />
          ))}
        </View>

        {/* Price summary */}
        {data?.data ? (
          <View style={styles.summaryBox}>
            <View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Product price</Text>
                <Text style={styles.summaryValue}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(data.data.totalPrice)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(Number(data.data.shippingFee))}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { fontWeight: "700" }]}>
                  Subtotal
                </Text>
                <Text style={[styles.summaryValue, { fontWeight: "700" }]}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(data.data.subtotal)}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <Text>Loading order summary...</Text>
        )}

        {/* Terms */}
        <View style={styles.termsRow}>
          <Checkbox
            value={agree}
            onValueChange={setAgree}
            color={agree ? "#00B200" : undefined}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.termsText}>
            I agree to{" "}
            <Text style={{ textDecorationLine: "underline", color: "#000" }}>
              Terms and conditions
            </Text>
          </Text>
        </View>

        {/* Place order */}
        <TouchableOpacity
          style={[
            styles.placeBtn,
            clearCartMutation.isPending && { opacity: 0.6 },
          ]}
          onPress={handlePlaceOrder}
          disabled={clearCartMutation.isPending}
        >
          {clearCartMutation.isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.placeText}>Place my order</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  stepWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  stepText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginHorizontal: 16,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  methodRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginTop: 4,
  },
  methodBox: {
    width: 90,
    height: 70,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  methodActive: {
    borderColor: "#000",
    backgroundColor: "#f7f7f7",
  },
  methodText: { fontSize: 12, marginTop: 4 },
  chooseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 20,
    alignItems: "center",
  },
  chooseTitle: { fontSize: 16, fontWeight: "600" },
  addNew: { color: "#E91E63", fontWeight: "600" },
  cardBox: {
    backgroundColor: "#007BFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 20,
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cardBrand: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
  cardNumber: {
    color: "#fff",
    fontSize: 18,
    letterSpacing: 2,
    marginVertical: 20,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLabel: {
    fontSize: 10,
    color: "#ddd",
  },
  cardValue: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "600",
  },
  orText: {
    textAlign: "center",
    fontSize: 13,
    color: "#777",
  },
  payIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
    marginHorizontal: 16,
  },
  summaryBox: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  summaryLabel: { color: "#444" },
  summaryValue: { color: "#000" },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
  },
  termsText: { fontSize: 13, color: "#444" },
  placeBtn: {
    backgroundColor: "#000",
    borderRadius: 25,
    paddingVertical: 15,
    marginHorizontal: 16,
    marginVertical: 26,
  },
  placeText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  progressLine: {
    width: 80,
    height: 1.5,
    backgroundColor: "#ccc",
    marginHorizontal: 6,
  },
});