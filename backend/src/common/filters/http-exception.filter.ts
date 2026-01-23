import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

/**
 * 全局 HTTP 异常过滤器
 * 统一处理所有异常，返回友好的错误信息
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 默认错误信息
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "服务器内部错误，请稍后重试";
    let code: number = status;

    // 处理 HTTP 异常
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === "object") {
        const resp = exceptionResponse as any;
        // 优先使用自定义 message
        message =
          resp.message ||
          (Array.isArray(resp.message) ? resp.message[0] : resp.error) ||
          message;
      }

      code = status;

      // 根据状态码提供友好的错误提示
      switch (status) {
        case HttpStatus.BAD_REQUEST:
          // 400：请求参数错误
          if (message.includes("validation failed")) {
            message = "请求参数格式错误，请检查输入";
          }
          break;

        case HttpStatus.UNAUTHORIZED:
          // 401：未授权
          message = "登录已过期，请重新登录";
          break;

        case HttpStatus.FORBIDDEN:
          // 403：权限不足
          message = "您没有权限执行此操作";
          break;

        case HttpStatus.NOT_FOUND:
          // 404：资源不存在
          if (!message || message === "Not Found") {
            message = "请求的资源不存在";
          }
          break;

        case HttpStatus.CONFLICT:
          // 409：数据冲突
          if (!message || message === "Conflict") {
            message = "数据冲突，请刷新后重试";
          }
          break;

        case HttpStatus.UNPROCESSABLE_ENTITY:
          // 422：数据验证失败
          break;

        case HttpStatus.TOO_MANY_REQUESTS:
          // 429：请求过于频繁
          message = "请求过于频繁，请稍后再试";
          break;
      }
    } else if (exception instanceof Error) {
      // 处理其他错误
      this.logger.error(
        `未捕获的错误: ${exception.message}`,
        exception.stack
      );

      // 数据库相关错误
      if (exception.message.includes("Unique constraint")) {
        message = "数据已存在，请勿重复操作";
        status = HttpStatus.CONFLICT;
        code = status;
      } else if (exception.message.includes("Foreign key constraint")) {
        message = "关联数据不存在，请检查输入";
        status = HttpStatus.BAD_REQUEST;
        code = status;
      } else if (
        exception.message.includes("prisma") ||
        exception.message.includes("database")
      ) {
        message = "数据库操作失败，请稍后重试";
      }
    } else {
      // 未知错误
      this.logger.error(`未知错误: ${JSON.stringify(exception)}`);
    }

    // 记录错误日志
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : ""
    );

    // 返回统一格式的错误响应
    response.status(status).json({
      success: false,
      code,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
