/**
 * API 统一类型定义
 */

// ============ 响应类型 ============

/**
 * 标准 API 响应格式
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * 分页响应格式
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============ 错误类型 ============

/**
 * 业务错误码枚举
 */
export enum ErrorCode {
  // 通用错误
  UNKNOWN = "UNKNOWN",
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT = "TIMEOUT",
  CANCELLED = "CANCELLED",

  // 认证错误
  UNAUTHORIZED = "UNAUTHORIZED",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  FORBIDDEN = "FORBIDDEN",

  // 业务错误
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  SERVER_ERROR = "SERVER_ERROR",
}

/**
 * API 错误类
 */
export class ApiError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode?: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  /**
   * 是否为网络错误（可重试）
   */
  get isRetryable(): boolean {
    return [ErrorCode.NETWORK_ERROR, ErrorCode.TIMEOUT].includes(this.code);
  }

  /**
   * 是否为认证错误
   */
  get isAuthError(): boolean {
    return [ErrorCode.UNAUTHORIZED, ErrorCode.TOKEN_EXPIRED].includes(
      this.code,
    );
  }
}

// ============ 请求配置 ============

/**
 * 扩展请求配置
 */
export interface RequestOptions {
  /**
   * 是否显示错误提示，默认 true
   */
  showError?: boolean;

  /**
   * 是否启用重试，默认 true（仅对网络错误）
   */
  retry?: boolean;

  /**
   * 最大重试次数，默认 2
   */
  maxRetries?: number;

  /**
   * 重试延迟（毫秒），默认 1000
   */
  retryDelay?: number;

  /**
   * 请求超时（毫秒），默认 10000
   */
  timeout?: number;

  /**
   * 是否跳过认证，默认 false
   */
  skipAuth?: boolean;

  /**
   * AbortController signal，用于取消请求
   */
  signal?: AbortSignal;
}
