import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MockPrismaService } from './mock-prisma.service';

const useMock = !process.env.DATABASE_URL || process.env.USE_MOCK === 'true' || process.env.NODE_ENV === 'test';

@Global()
@Module({
  providers: [
    {
      provide: PrismaService,
      useClass: useMock ? MockPrismaService : PrismaService,
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
