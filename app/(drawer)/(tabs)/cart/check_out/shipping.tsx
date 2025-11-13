import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createOrder } from "@/services/order";
import { OrderRequest } from "@/types";

export default function ShippingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [email, setEmail] = useState<string>("");
  const [form, setForm] = useState<OrderRequest>({
    firstName: "",
    lastName: "",
    country: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    shippingMethod: "free",
    orderItems: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shipping, setShipping] = useState<"free" | "normal" | "fast">("free");

  // Lấy email user từ AsyncStorage
  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem("userInfo");
      if (userData) {
        const parsed = JSON.parse(userData);
        setEmail(parsed?.email || "");
      }
    })();
  }, []);

  // Lấy orderItems từ params khi mở trang
  useEffect(() => {
    if (params?.orderItems) {
      try {
        const items = JSON.parse(params.orderItems as string);
        setForm((prev) => ({ ...prev, orderItems: items }));
      } catch (err) {
        console.log("Lỗi parse orderItems:", err);
      }
    }
  }, []);

  // Mutation tạo đơn hàng
  const { mutate: orderMutation, isPending } = useMutation({
    mutationFn: () => createOrder({ ...form, shippingMethod: shipping }, email),
    mutationKey: ["createOrder"],
    onSuccess: () => {
      router.push("/cart/check_out/payment");
    },
    onError: (error: any) => {
      if (error.response?.data) {
        const res = error.response.data;
        if (res.errors) setErrors(res.errors);
        else if (res.message) Alert.alert("Thất bại", res.message);
        else Alert.alert("Lỗi", "Đã xảy ra lỗi, vui lòng thử lại!");
      } else if (error.request) {
        Alert.alert("Lỗi mạng", "Không thể kết nối đến server!");
      } else {
        Alert.alert("Lỗi", error.message || "Lỗi không xác định");
      }
    },
  });

  const handleChange = (field: keyof OrderRequest, value: string) => {
    setForm({ ...form, [field]: value });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Minimal validation trước khi gửi request
  const validateBeforeSubmit = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.country?.trim()) newErrors.country = "Country is required";
    if (!form.street.trim()) newErrors.street = "Street name is required";
    if (!form.city?.trim()) newErrors.city = "City is required";
    if (!form.zip.trim()) newErrors.zip = "Zip-code is required";

    const phoneError = validateVietnamPhone(form.phone);
    if (phoneError) newErrors.phone = phoneError;
    if (!form.orderItems || form.orderItems.length === 0)
      Alert.alert("Lỗi", "Không có sản phẩm nào trong đơn hàng!");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && form.orderItems.length > 0;
  };

  const validateVietnamPhone = (phone: string) => {
  const trimmed = phone.trim();
  const vietnamPhoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;

  if (!trimmed) {
    return "Phone number is required";
  } else if (!vietnamPhoneRegex.test(trimmed)) {
    return "Invalid Vietnam phone number";
  }

  return null; 
  };

  const handleCreateOrder = () => {
    if (!validateBeforeSubmit()) return;
    orderMutation();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check out</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <FontAwesome6 name="location-dot" size={24} color="black" />
        <View style={styles.progressLine} />
        <MaterialIcons name="payment" size={24} color="#999" />
        <View style={styles.progressLine} />
        <Ionicons name="checkmark-circle" size={24} color="#ccc" />
      </View>

      <View style={styles.stepWrapper}>
        <Text style={styles.stepText}>STEP 1</Text>
      </View>

      <Text style={styles.title}>Shipping</Text>


      <ScrollView showsVerticalScrollIndicator={false}>
        

        <View style={styles.form}>
          {[
            { key: "firstName", label: "First name" },
            { key: "lastName", label: "Last name" },
            { key: "country", label: "Country" },
            { key: "street", label: "Street name" },
            { key: "city", label: "City" },
            { key: "state", label: "State / Province" },
            { key: "zip", label: "Zip-code" },
            { key: "phone", label: "Phone number" },
          ].map((item) => (
            <View key={item.key} style={{ marginBottom: 10 }}>
              <Text style={styles.label}>{item.label}</Text>
              <TextInput
                placeholder={item.label}
                keyboardType={item.key === "phone" ? "phone-pad" : "default"}
                style={[styles.input, errors[item.key] && { borderColor: "red" }]}
                value={form[item.key as keyof OrderRequest] as string}
                onChangeText={(t) => handleChange(item.key as keyof OrderRequest, t)}
              />
              {errors[item.key] && <Text style={styles.errorText}>{errors[item.key]}</Text>}
            </View>
          ))}
        </View>

        <Text style={[styles.title, { marginTop: 16 }]}>Shipping method</Text>
        <View style={styles.shippingBox}>
          <RadioButton.Group onValueChange={(v) => setShipping(v as "free" | "normal" | "fast")} value={shipping}>
            {[
              { key: "free", title: "Free — Delivery to home", sub: "3-7 business days" },
              { key: "normal", title: "50.000₫ — Normal Delivery", sub: "4-6 business days" },
              { key: "fast", title: "100.000₫ — Fast Delivery", sub: "2-3 business days" },
            ].map((opt) => (
              <View key={opt.key} style={styles.radioRow}>
                <RadioButton value={opt.key} color="#000" />
                <View>
                  <Text style={styles.radioTitle}>{opt.title}</Text>
                  <Text style={styles.radioSub}>{opt.sub}</Text>
                </View>
              </View>
            ))}
          </RadioButton.Group>
        </View>

        <TouchableOpacity
          style={[styles.continueBtn, isPending && { opacity: 0.7 }]}
          onPress={handleCreateOrder}
          disabled={isPending}
        >
          {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.continueText}>Continue to payment</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  stepWrapper: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, marginTop: 20 },
  stepText: { fontSize: 13, fontWeight: "600", marginLeft: 6, color: "#555" },
  title: { fontSize: 20, fontWeight: "700", marginHorizontal: 16, marginTop: 10 },
  form: { marginHorizontal: 16, marginTop: 6 },
  label: { fontSize: 14, marginTop: 10, color: "#444" },
  input: { borderWidth: 1, borderColor: "#eee", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, backgroundColor: "#fafafa", marginTop: 4 },
  errorText: { color: "red", fontSize: 12, marginTop: 2 },
  shippingBox: { marginHorizontal: 16, marginTop: 6 },
  radioRow: { flexDirection: "row", alignItems: "flex-start", marginVertical: 5, borderTopWidth: 1, borderColor: "#ccc", padding: 7 },
  radioTitle: { fontSize: 14, fontWeight: "600" },
  radioSub: { fontSize: 13, color: "#777" },
  continueBtn: { backgroundColor: "#000", borderRadius: 25, paddingVertical: 15, marginHorizontal: 16, marginVertical: 26 },
  continueText: { textAlign: "center", color: "#fff", fontSize: 15, fontWeight: "600" },
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
