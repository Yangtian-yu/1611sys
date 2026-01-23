import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动移除未定义的属性
      forbidNonWhitelisted: false, // 不抛出错误，只是忽略
      transform: true, // 自动转换类型
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // 启用 CORS - 支持所有本地开发环境
  app.enableCors({
    origin: true, // 在开发环境允许所有源
    credentials: true, // 允许携带凭证
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });

  // 设置全局前缀
  app.setGlobalPrefix("api");

  const port = process.env.PORT || 3000;
  // 显式监听 0.0.0.0 以支持容器间通信
  await app.listen(port, "0.0.0.0");

  console.log(`🚀 后端服务已启动: http://0.0.0.0:${port}/api`);
}

bootstrap();
