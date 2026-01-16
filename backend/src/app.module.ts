import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { DutyModule } from './modules/duty/duty.module';

// 根据环境变量决定使用真实数据库还是 Mock 数据
const useMock = !process.env.DATABASE_URL || process.env.USE_MOCK === 'true';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    DutyModule,
  ],
  providers: [],
})
export class AppModule {}
