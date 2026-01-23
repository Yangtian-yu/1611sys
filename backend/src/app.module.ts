import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { DutyModule } from "./modules/duty/duty.module";
import { UserModule } from "./modules/user/user.module";
import { MailModule } from "./modules/mail/mail.module";
import { HealthModule } from "./modules/health/health.module";

// 根据环境变量决定使用真实数据库还是 Mock 数据
const useMock = !process.env.DATABASE_URL || process.env.USE_MOCK === "true";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    DutyModule,
    UserModule,
    MailModule,
    HealthModule,
  ],
  providers: [],
})
export class AppModule {}
