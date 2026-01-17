/**
 * 请求取消管理器
 * 基于 AbortController 实现请求取消
 */

class RequestCancelManager {
  private controllers: Map<string, AbortController> = new Map();

  /**
   * 创建一个新的 AbortController 并返回其 signal
   * @param key 请求唯一标识
   * @param cancelPrevious 是否取消之前相同 key 的请求
   */
  create(key: string, cancelPrevious = true): AbortSignal {
    // 如果需要取消之前的请求
    if (cancelPrevious && this.controllers.has(key)) {
      this.cancel(key);
    }

    const controller = new AbortController();
    this.controllers.set(key, controller);
    return controller.signal;
  }

  /**
   * 取消指定的请求
   */
  cancel(key: string): void {
    const controller = this.controllers.get(key);
    if (controller) {
      controller.abort();
      this.controllers.delete(key);
    }
  }

  /**
   * 取消所有请求
   */
  cancelAll(): void {
    this.controllers.forEach((controller) => {
      controller.abort();
    });
    this.controllers.clear();
  }

  /**
   * 移除已完成的请求（不取消）
   */
  remove(key: string): void {
    this.controllers.delete(key);
  }

  /**
   * 生成请求的唯一标识
   */
  generateKey(method: string, url: string): string {
    return `${method.toUpperCase()}:${url}`;
  }
}

// 导出单例
export const cancelManager = new RequestCancelManager();

/**
 * 创建一个与路由绑定的取消令牌
 * 用于路由切换时自动取消未完成的请求
 */
export function createRouteCancelToken(): AbortController {
  return new AbortController();
}
