import axios from "axios";
import { ElMessage } from "element-plus";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 10000,
});

// 请求拦截器：添加 token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：处理错误
apiClient.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 如果后端统一返回 success: false 系列，也可以这里处理
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || "请求失败";
    
    if (error.response?.status === 401) {
      ElMessage.error("登录已过期，请重新登录");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else {
      ElMessage.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
