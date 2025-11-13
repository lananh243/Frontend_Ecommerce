import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const OrderCompletedScreen = () => {
//   useEffect(() => {
//   const timer = setTimeout(() => {
//     router.replace("/cart");
//   }, 1000);

//   return () => clearTimeout(timer);
// }, []);
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check out</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Step indicator */}
      <View style={styles.progressContainer}>
        <FontAwesome6 name="location-dot" size={24} color="black" />
        <View style={styles.progressLine} />
        <MaterialIcons name="payment" size={24} color="black" />
        <View style={styles.progressLine} />
        <Ionicons name="checkmark-circle" size={24} color="black" />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Order Completed</Text>

        <View style={styles.iconBox}>
          <Ionicons name="bag-check-outline" size={90} color="#000" />
        </View>

        <Text style={styles.text}>
          Thank you for your purchase.
        </Text>
        <Text style={styles.text}>
          You can view your order in ‘My Orders’ section.
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.replace("/")}>
        <Text style={styles.buttonText}>Continue shopping</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OrderCompletedScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
  },
  iconBox: {
    marginVertical: 10,
  },
  text: {
    textAlign: "center",
    color: "#555",
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#000",
    marginHorizontal: 16,
    marginBottom: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 15,
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
