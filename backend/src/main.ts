import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用全局验证管道
  app.useGlobalPipes(new ValidationPipe());

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
