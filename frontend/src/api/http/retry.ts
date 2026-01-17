/**
 * 请求重试逻辑
 * 支持指数退避和可配置的重试策略
 */

import type { AxiosError } from "axios";

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  /**
   * 是否使用指数退避
   */
  exponentialBackoff?: boolean;
}

const DEFAULT_CONFIG: RetryConfig = {
  maxRetries: 2,
  retryDelay: 1000,
  exponentialBackoff: true,
};

/**
 * 判断错误是否可重试
 */
export function isRetryableError(error: AxiosError): boolean {
  // 请求被取消不重试
  if (error.code === "ERR_CANCELED") {
    return false;
  }

  // 网络错误可重试
  if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
    return true;
  }

  // 超时可重试
  if (error.code === "ETIMEDOUT" || error.message.includes("timeout")) {
    return true;
  }

  // 5xx 服务器错误可重试（除了 501）
  const status = error.response?.status;
  if (status && status >= 500 && status !== 501) {
    return true;
  }

  return false;
}

/**
 * 计算重试延迟
 */
export function calculateRetryDelay(
  attempt: number,
  baseDelay: number,
  exponentialBackoff: boolean,
): number {
  if (exponentialBackoff) {
    // 指数退避: 1s, 2s, 4s, 8s...
    return baseDelay * Math.pow(2, attempt - 1);
  }
  return baseDelay;
}

/**
 * 延迟函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 创建重试执行器
 */
export function createRetryExecutor<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {},
): () => Promise<T> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  let attempt = 0;

  const execute = async (): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      attempt++;

      if (
        attempt <= finalConfig.maxRetries &&
        isRetryableError(error as AxiosError)
      ) {
        const delayMs = calculateRetryDelay(
          attempt,
          finalConfig.retryDelay,
          finalConfig.exponentialBackoff ?? true,
        );

        console.warn(
          `[HTTP] 请求失败，${delayMs}ms 后进行第 ${attempt} 次重试...`,
        );

        await delay(delayMs);
        return execute();
      }

      throw error;
    }
  };

  return execute;
}
