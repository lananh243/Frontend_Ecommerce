import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ErrorState, LoginRequest } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "@/services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ErrorState>({
    email: "",
    password: "",
  });

  const { mutate: loginMutation } = useMutation({
    mutationFn: loginUser,
    mutationKey: ["login"],
    onSuccess: async ({ data }: any) => {
      const { accessToken, ...user } = data;
      // Lưu song song token và user, chỉ khi có token hợp lệ
      if (accessToken) {
        await Promise.all([
          AsyncStorage.setItem("userToken", accessToken),
          AsyncStorage.setItem("userInfo", JSON.stringify(user)),
        ]);

        // Làm mới cache để Profile tự refetch
        queryClient.invalidateQueries({ queryKey: ["profile"] });

        Alert.alert("Thành công", "Đăng nhập thành công!");
        router.replace("/(drawer)/(tabs)");
      } else {
        Alert.alert("Lỗi", "Không nhận được token đăng nhập!");
      }
    },
    onError: (error: any) => {
      if (error.response && error.response.data) {
        const responseData = error.response.data;

        if (responseData.errors) {
          // Lỗi validate form
          setErrors({
            email: responseData.errors.email || "",
            password: responseData.errors.password || "",
          });
        } else if (responseData.message) {
          // Lỗi chung như sai email/mật khẩu
          Alert.alert("Thất bại", responseData.message);
        } else {
          Alert.alert("Thất bại", "Đã xảy ra lỗi, vui lòng thử lại!");
        }
      } else {
        // Lỗi mạng
        Alert.alert(
          "Lỗi mạng!",
          error.message || "Không thể kết nối đến máy chủ."
        );
      }
    },

  });

  const handleLogin = () => {
    setErrors({ email: "", password: "" });
    loginMutation(inputValue);
  };

  const handleChange = (field: keyof LoginRequest, value: string) => {
    setInputValue({ ...inputValue, [field]: value });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Log into</Text>
        <Text style={styles.subHeaderText}>your account</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
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
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>

      {/* Forgot password */}
      <TouchableOpacity
        onPress={() => console.log("Forgot Password")}
        style={styles.forgotContainer}
      >
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login button */}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>LOG IN</Text>
      </TouchableOpacity>

      {/* or login with */}
      <Text style={styles.orText}>or log in with</Text>

      {/* Social icons */}
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

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/account/register")}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  headerContainer: {
    marginBottom: 50,
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
    marginTop: 20,
  },
  form: {
    marginBottom: 10,
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
  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 30,
  },
  forgotText: {
    color: "#555",
    fontSize: 13,
  },
  loginBtn: {
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
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  orText: {
    textAlign: "center",
    color: "#aaa",
    marginVertical: 25,
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
    marginTop: 50,
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
