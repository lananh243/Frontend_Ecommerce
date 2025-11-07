import axios from "axios";
import { Alert } from "react-native";

const axiosInstance = axios.create({
  baseURL: "http://192.168.100.202:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// // Request interceptor: gắn token cố định
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJodXllbkBnbWFpbC5jb20iLCJpYXQiOjE3NjIzNjE3ODYsImV4cCI6MTc2MjQ0ODE4Nn0.UrBC3LzD3a3WWuOVffHaFNXB--ATCYqgIEmlW81YXagu3RxCYB20PI0zpOClk-exnLSfyNChJXH76rJngTRYjg"; // token cứng
//     if (accessToken) {
//       config.headers["Authorization"] = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor: bắt lỗi
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Kiểm tra error.response tồn tại trước khi đọc status
//     if (error.response) {
//       const status = error.response.status;
//       if (status === 401) {
//         Alert.alert(
//           "Cảnh báo",
//           "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại"
//         );
//       } else if (status === 403) {
//         Alert.alert("Cảnh báo", "Bạn không có quyền truy cập");
//       }
//     } else {
//       // Lỗi network / timeout
//       Alert.alert("Lỗi", "Không thể kết nối đến server");
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
