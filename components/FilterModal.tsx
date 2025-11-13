import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useMutation } from "@tanstack/react-query";
import { getFilteredProducts } from "@/services/product";

const { width } = Dimensions.get("window");

const COLORS = [
  { name: "Trắng", code: "#FFFFFF" },
  { name: "Đen", code: "#1A1A1A" },
  { name: "Nâu", code: "#D4A574" },
  { name: "Xanh dương", code: "#4285F4" },
  { name: "Vàng", code: "#e1e112ff" },
  { name: "Hồng", code: "#E91E63" },
];

const SIZES = ["XS", "S", "M", "L", "XL"];

// 🔹 Hàm định dạng tiền VND
const formatCurrency = (value: number) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const FilterModal = ({ visible, onClose, onApplyFilters }: any) => {
  // Giá trị mặc định: 100.000 -> 1.000.000
  const [priceRange, setPriceRange] = useState<[number, number]>([10000, 1000000]);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const slideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : width,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();
  }, [visible]);

  // Mutation gọi API filter
  const { mutate: filterProducts, isPending } = useMutation({
    mutationFn: getFilteredProducts,
    onSuccess: (data) => {
      onApplyFilters?.(data);
      onClose();
    },
    onError: (error) => console.error("❌ Lỗi lọc sản phẩm:", error),
  });

  const toggleSize = (size: string) => {
    setSelectedSize((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleApply = () => {
    const filters = {
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      color: selectedColor,
      size: selectedSize,
      categoryId: selectedCategoryId,
    };
    filterProducts(filters);
  };

  const handleReset = () => {
    setPriceRange([10000, 1000000]);
    setSelectedColor("");
    setSelectedSize([]);
    setSelectedCategoryId(null);
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <Animated.View style={[styles.panel, { transform: [{ translateX: slideAnim }] }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Bộ lọc</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* GIÁ */}
            <Text style={styles.label}>Giá sản phẩm</Text>
            <View style={styles.priceWrapper}>
              <MultiSlider
                values={priceRange}
                sliderLength={250}
                onValuesChange={(values) => setPriceRange([values[0], values[1]])}
                min={10000}
                max={1000000}
                step={50000}
                selectedStyle={{ backgroundColor: "#000" }}
                unselectedStyle={{ backgroundColor: "#ccc" }}
                markerStyle={styles.markerStyle}
              />
              <View style={styles.priceTextRow}>
                <Text style={styles.priceText}>{formatCurrency(priceRange[0])}</Text>
                <Text style={styles.priceText}>{formatCurrency(priceRange[1])}</Text>
              </View>
            </View>

            {/* MÀU SẮC */}
            <Text style={styles.label}>Màu sắc</Text>
            <View style={styles.colorContainer}>
              {COLORS.map((item) => (
                <TouchableOpacity
                  key={item.code}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: item.code },
                    selectedColor === item.name && styles.colorActive,
                  ]}
                  onPress={() => setSelectedColor(item.name)}
                />
              ))}
            </View>

            {/* KÍCH CỠ */}
            <Text style={styles.label}>Kích cỡ</Text>
            <View style={styles.sizeContainer}>
              {SIZES.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeBox,
                    selectedSize.includes(size) && styles.sizeActive,
                  ]}
                  onPress={() => toggleSize(size)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize.includes(size) && styles.sizeTextActive,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* FOOTER */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
              <Text style={styles.resetText}>Đặt lại</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApply} style={styles.applyBtn}>
              {isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.applyText}>Áp dụng</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  backdrop: { flex: 1 },
  panel: {
    backgroundColor: "#fff",
    width: "80%",
    height: "100%",
    padding: 20,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 0 },
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: "700" },
  label: { fontSize: 16, fontWeight: "600", marginTop: 15 },
  priceWrapper: { alignItems: "center", marginTop: 10 },
  markerStyle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",
  },
  priceTextRow: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  priceText: { color: "#000", fontWeight: "600" },
  colorContainer: { flexDirection: "row", marginTop: 10 },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
  },
  colorActive: { borderWidth: 2, borderColor: "#000" },
  sizeContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  sizeBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  sizeActive: { backgroundColor: "#000", borderColor: "#000" },
  sizeText: { color: "#000" },
  sizeTextActive: { color: "#fff" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  resetBtn: { padding: 12 },
  applyBtn: { backgroundColor: "#000", padding: 12, borderRadius: 8 },
  resetText: { color: "#000", fontSize: 16 },
  applyText: { color: "#fff", fontSize: 16 },
});
