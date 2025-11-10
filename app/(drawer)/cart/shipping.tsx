import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import { router } from "expo-router";

const ShippingScreen = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    country: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  const [shipping, setShipping] = useState("free");
  const [sameBilling, setSameBilling] = useState(false);
  const [coupon, setCoupon] = useState("");

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Step indicator */}
        <View style={styles.stepWrapper}>
          <Ionicons name="location-outline" size={20} color="black" />
          <Text style={styles.stepText}>STEP 1</Text>
        </View>

        <Text style={styles.title}>Shipping</Text>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>
            First name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="First name"
            style={styles.input}
            value={form.firstName}
            onChangeText={(t) => handleChange("firstName", t)}
          />

          <Text style={styles.label}>
            Last name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="Last name"
            style={styles.input}
            value={form.lastName}
            onChangeText={(t) => handleChange("lastName", t)}
          />

          <Text style={styles.label}>Country</Text>
          <TextInput
            placeholder="Select country"
            style={styles.input}
            value={form.country}
            onChangeText={(t) => handleChange("country", t)}
          />

          <Text style={styles.label}>
            Street name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="Street name"
            style={styles.input}
            value={form.street}
            onChangeText={(t) => handleChange("street", t)}
          />

          <Text style={styles.label}>City</Text>
          <TextInput
            placeholder="City"
            style={styles.input}
            value={form.city}
            onChangeText={(t) => handleChange("city", t)}
          />

          <Text style={styles.label}>State / Province</Text>
          <TextInput
            placeholder="State / Province"
            style={styles.input}
            value={form.state}
            onChangeText={(t) => handleChange("state", t)}
          />

          <Text style={styles.label}>
            Zip-code <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="Zip-code"
            style={styles.input}
            value={form.zip}
            onChangeText={(t) => handleChange("zip", t)}
          />

          <Text style={styles.label}>
            Phone number <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            placeholder="Phone number"
            keyboardType="phone-pad"
            style={styles.input}
            value={form.phone}
            onChangeText={(t) => handleChange("phone", t)}
          />
        </View>

        {/* Shipping Method */}
        <Text style={[styles.title, { marginTop: 16 }]}>Shipping method</Text>
        <View style={styles.shippingBox}>
          <RadioButton.Group
            onValueChange={(value) => setShipping(value)}
            value={shipping}
          >
            <View style={styles.radioRow}>
              <RadioButton value="free" color="#000" />
              <View>
                <Text style={styles.radioTitle}>Free  —  Delivery to home</Text>
                <Text style={styles.radioSub}>Delivery from 3 to 7 business days</Text>
              </View>
            </View>

            <View style={styles.radioRow}>
              <RadioButton value="normal" color="#000" />
              <View>
                <Text style={styles.radioTitle}>$9.90  —  Delivery to home</Text>
                <Text style={styles.radioSub}>Delivery from 4 to 6 business days</Text>
              </View>
            </View>

            <View style={styles.radioRow}>
              <RadioButton value="fast" color="#000" />
              <View>
                <Text style={styles.radioTitle}>$9.90  —  Fast Delivery</Text>
                <Text style={styles.radioSub}>Delivery from 2 to 3 business days</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>

        {/* Coupon Code */}
        <Text style={[styles.title, { marginTop: 20 }]}>Coupon Code</Text>
        <View style={styles.couponRow}>
          <TextInput
            placeholder="Have a code? Type it here..."
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            value={coupon}
            onChangeText={setCoupon}
          />
          <TouchableOpacity style={styles.validateBtn}>
            <Text style={{ color: "#fff", fontWeight: "600" }}>Validate</Text>
          </TouchableOpacity>
        </View>

        {/* Billing */}
        <Text style={[styles.title, { marginTop: 20 }]}>Billing Address</Text>
        <View style={styles.billingRow}>
          <TouchableOpacity
            onPress={() => setSameBilling(!sameBilling)}
            style={[styles.checkbox, sameBilling && styles.checkedBox]}
          >
            {sameBilling && <Ionicons name="checkmark" color="#fff" size={14} />}
          </TouchableOpacity>
          <Text style={styles.billingText}>
            Copy address data from shipping
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.continueBtn} onPress={() => router.push("/cart/payment")}>
          <Text style={styles.continueText}>Continue to payment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShippingScreen;

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
    paddingHorizontal: 16,
    marginTop: 6,
  },
  stepText: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
    color: "#555",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    marginHorizontal: 16,
    marginTop: 10,
  },
  form: {
    marginHorizontal: 16,
    marginTop: 6,
  },
  label: {
    fontSize: 14,
    marginTop: 10,
    color: "#444",
  },
  required: { color: "red" },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#fafafa",
    marginTop: 4,
  },
  shippingBox: {
    marginHorizontal: 16,
    marginTop: 6,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 5,
    borderTopWidth: 1,
    borderColor: "#ccc",
    padding: 7
  },
  radioTitle: { fontSize: 14, fontWeight: "600" },
  radioSub: { fontSize: 13, color: "#777" },
  couponRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
  },
  validateBtn: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  billingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkedBox: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  billingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#444",
  },
  continueBtn: {
    backgroundColor: "#000",
    borderRadius: 25,
    paddingVertical: 15,
    marginHorizontal: 16,
    marginVertical: 26,
  },
  continueText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
