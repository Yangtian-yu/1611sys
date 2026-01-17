/**
 * 企业级 HTTP 客户端
 * 封装 axios，提供统一的请求/响应处理
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { ElMessage } from "element-plus";
import {
  ApiError,
  ErrorCode,
  type ApiResponse,
  type RequestOptions,
} from "@/types/api";
import { cancelManager } from "./cancel";
import { createRetryExecutor } from "./retry";

// ============ 默认配置 ============

const DEFAULT_OPTIONS: Required<RequestOptions> = {
  showError: true,
  retry: true,
  maxRetries: 2,
  retryDelay: 1000,
  timeout: 10000,
  skipAuth: false,
  signal: undefined as unknown as AbortSignal,
};

// ============ HTTP 客户端类 ============

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
      timeout: DEFAULT_OPTIONS.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 注入 Token
        const token = localStorage.getItem("token");
        if (token && !config.headers?.["X-Skip-Auth"]) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 清理自定义 header
        delete config.headers?.["X-Skip-Auth"];

        return config;
      },
      (error) => Promise.reject(error),
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // 直接返回业务数据，解包 response.data
        return response;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      },
    );
  }

  /**
   * 统一错误处理
   */
  private handleError(error: unknown): ApiError {
    // 请求被取消
    if (axios.isCancel(error)) {
      return new ApiError(ErrorCode.CANCELLED, "请求已取消");
    }

    if (!axios.isAxiosError(error)) {
      return new ApiError(ErrorCode.UNKNOWN, "未知错误");
    }

    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    // 网络错误
    if (error.code === "ERR_NETWORK") {
      return new ApiError(
        ErrorCode.NETWORK_ERROR,
        "网络连接失败，请检查网络",
        status,
      );
    }

    // 超时
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return new ApiError(ErrorCode.TIMEOUT, "请求超时，请重试", status);
    }

    // HTTP 状态码错误
    switch (status) {
      case 401:
        return new ApiError(
          ErrorCode.UNAUTHORIZED,
          "登录已过期，请重新登录",
          status,
        );
      case 403:
        return new ApiError(ErrorCode.FORBIDDEN, "无权限访问", status);
      case 404:
        return new ApiError(ErrorCode.NOT_FOUND, "资源不存在", status);
      case 409:
        return new ApiError(ErrorCode.CONFLICT, message || "数据冲突", status);
      case 422:
        return new ApiError(
          ErrorCode.VALIDATION_ERROR,
          message || "数据验证失败",
          status,
          error.response?.data,
        );
      default:
        if (status && status >= 500) {
          return new ApiError(
            ErrorCode.SERVER_ERROR,
            "服务器错误，请稍后重试",
            status,
          );
        }
        return new ApiError(ErrorCode.UNKNOWN, message || "请求失败", status);
    }
  }

  /**
   * 处理认证错误
   */
  private handleAuthError(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 避免重复跳转
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  /**
   * 显示错误消息
   */
  private showErrorMessage(error: ApiError): void {
    ElMessage.error(error.message);
  }

  /**
   * 核心请求方法
   */
  private async request<T>(
    config: AxiosRequestConfig,
    options: RequestOptions = {},
  ): Promise<T> {
    const finalOptions = { ...DEFAULT_OPTIONS, ...options };

    // 设置超时
    config.timeout = finalOptions.timeout;

    // 设置取消信号
    if (finalOptions.signal) {
      config.signal = finalOptions.signal;
    }

    // 跳过认证
    if (finalOptions.skipAuth) {
      config.headers = {
        ...config.headers,
        "X-Skip-Auth": "true",
      };
    }

    // 创建请求执行函数
    const executeRequest = async (): Promise<T> => {
      const response = await this.instance.request<ApiResponse<T>>(config);
      // 解包：直接返回 data 字段
      return response.data.data;
    };

    // 根据配置决定是否启用重试
    const executor = finalOptions.retry
      ? createRetryExecutor(executeRequest, {
          maxRetries: finalOptions.maxRetries,
          retryDelay: finalOptions.retryDelay,
        })
      : executeRequest;

    try {
      return await executor();
    } catch (error) {
      const apiError =
        error instanceof ApiError ? error : this.handleError(error);

      // 处理认证错误
      if (apiError.isAuthError) {
        this.handleAuthError();
      }

      // 显示错误消息
      if (finalOptions.showError && apiError.code !== ErrorCode.CANCELLED) {
        this.showErrorMessage(apiError);
      }

      throw apiError;
    }
  }

  // ============ 公共方法 ============

  /**
   * GET 请求
   */
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>({ method: "GET", url }, options);
  }

  /**
   * POST 请求
   */
  post<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>({ method: "POST", url, data }, options);
  }

  /**
   * PUT 请求
   */
  put<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>({ method: "PUT", url, data }, options);
  }

  /**
   * DELETE 请求
   */
  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>({ method: "DELETE", url }, options);
  }

  /**
   * PATCH 请求
   */
  patch<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>({ method: "PATCH", url, data }, options);
  }

  /**
   * 创建带取消功能的请求
   * @param key 请求唯一标识，相同 key 的请求会取消之前的
   */
  withCancel(key: string) {
    const signal = cancelManager.create(key);
    return {
      get: <T>(url: string, options?: RequestOptions) =>
        this.get<T>(url, { ...options, signal }),
      post: <T>(url: string, data?: unknown, options?: RequestOptions) =>
        this.post<T>(url, data, { ...options, signal }),
      put: <T>(url: string, data?: unknown, options?: RequestOptions) =>
        this.put<T>(url, data, { ...options, signal }),
      delete: <T>(url: string, options?: RequestOptions) =>
        this.delete<T>(url, { ...options, signal }),
    };
  }

  /**
   * 取消请求
   */
  cancel(key: string): void {
    cancelManager.cancel(key);
  }

  /**
   * 取消所有请求
   */
  cancelAll(): void {
    cancelManager.cancelAll();
  }
}

// 导出单例
export const http = new HttpClient();

// 默认导出
export default http;
