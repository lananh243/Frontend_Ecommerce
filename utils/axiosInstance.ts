import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.2.3:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});


axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



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
