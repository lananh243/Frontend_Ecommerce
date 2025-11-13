import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ScrollView } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorState, RegisterRequest, User } from "@/types";
import { registerUser } from "@/services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<RegisterRequest>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState<ErrorState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    mutate: registerMutation
  } = useMutation({
    mutationFn: registerUser,
    mutationKey: ["register"],
    onSuccess: async (response: any) => {
  const token = response?.data?.accessToken;
  const user = response?.data; // hoặc response?.user
  if (token) await AsyncStorage.setItem("userToken", token);
  if (user) await AsyncStorage.setItem("userInfo", JSON.stringify(user));

  Alert.alert("Thành công", "Đăng ký thành công!");
  router.push("/account/login"); // có thể chuyển thẳng vào app nếu muốn auto-login
},
    onError: (error: any) => {

      if (error.response && error.response.data) {
        const responseData = error.response.data;

        if (responseData.errors) {
          setErrors({
            firstName: responseData.errors.firstName || "",
            lastName: responseData.errors.lastName || "",
            email: responseData.errors.email || "",
            password: responseData.errors.password || "",
            confirmPassword: responseData.errors.confirmPassword || "",
          });
        } else if (responseData.message) {
          Alert.alert("Thất bại", responseData.message);
        } else {
          Alert.alert("Thất bại", "Đã xảy ra lỗi, vui lòng thử lại!");
        }
      } else if (error.request) {
        console.log("Request gửi đi nhưng không nhận được phản hồi:", error.request);
        Alert.alert("Lỗi mạng!", "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại server.");
      } else {
        console.log("Lỗi không xác định:", error.message);
        Alert.alert("Lỗi", error.message || "Lỗi không xác định xảy ra.");
      }
},

  });

  const handleRegister = () => {
    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    registerMutation(inputValue)
  }

  const handleChange = (field: keyof RegisterRequest, value: any) => {
    setInputValue({
      ...inputValue,
      [field]: value
    })
    // Xóa lỗi
    setErrors((prev) => ({ ...prev, [field] : ""}))
  }
  return (
    <ScrollView style={styles.container}
      keyboardShouldPersistTaps="handled">
      {/* Tiêu đề */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Create</Text>
        <Text style={styles.subHeaderText}>your account</Text>
      </View>

      {/* Form input */}
      <View style={styles.form}>
        <TextInput
          style={[styles.input, errors.firstName && styles.inputError]}
          placeholder="Enter your first name"
          placeholderTextColor="#999"
          value={inputValue.firstName}
          onChangeText={(text) => handleChange("firstName", text)}
        />
        {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

        <TextInput
          style={[styles.input, errors.lastName && styles.inputError]}
          placeholder="Enter your last name"
          placeholderTextColor="#999"
          value={inputValue.lastName}
          onChangeText={(text) => handleChange("lastName", text)}
        />
        {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email address"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={inputValue.email}
          onChangeText={(text) => handleChange("email", text)}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={inputValue.password}
          onChangeText={(text) => handleChange("password", text)}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <TextInput
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          placeholder="Confirm password"
          placeholderTextColor="#999"
          secureTextEntry
          value={inputValue.confirmPassword}
          onChangeText={(text) => handleChange("confirmPassword", text)}
        />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      </View>

      {/* Nút đăng ký */}
      <TouchableOpacity style={styles.signUpBtn} onPress={handleRegister}>
        <Text style={styles.signUpText}>SIGN UP</Text>
      </TouchableOpacity>

      {/* Hoặc đăng nhập bằng */}
      <Text style={styles.orText}>or sign up with</Text>

      {/* Icon mạng xã hội */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialBtn}>
          <Ionicons name="logo-apple" size={22} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Ionicons name="logo-google" size={22} color="red" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Ionicons name="logo-facebook" size={22} color="#1877F2" />
        </TouchableOpacity>
      </View>

      {/* Đã có tài khoản */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have account? </Text>
        <TouchableOpacity onPress={() => router.push("/account/login")}>
          <Text style={styles.footerLink}>Log In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  headerContainer: {
    marginBottom: 40,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
  },
  subHeaderText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginTop: 20
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
    marginBottom: 25,
  },
  inputError: { borderBottomColor: "#FF4D4F" },
  errorText: { color: "#FF4D4F", fontSize: 12 },
  signUpBtn: {
    backgroundColor: "#2E221D", 
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center", 
    marginTop: 20,
    width: "60%", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  signUpText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  orText: {
    textAlign: "center",
    color: "#aaa",
    marginVertical: 20,
    fontSize: 13,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 25,
    marginBottom: 40,
  },
  socialBtn: {
    width: 45,
    height: 45,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    color: "#000",
    fontSize: 14,
  },
  footerLink: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});