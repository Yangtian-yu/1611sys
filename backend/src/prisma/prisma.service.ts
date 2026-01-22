import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

// ============================================================
// Prisma 7 升级说明 (当前使用 Prisma 5.20.0)
// ============================================================
//
// 当升级到 Prisma 7 时,需要使用驱动适配器:
//
// import { Pool } from "pg";
// import { PrismaPg } from "@prisma/adapter-pg";
//
// constructor() {
//   const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//   });
//   const adapter = new PrismaPg(pool);
//   super({ adapter });
//   this.pool = pool;
// }
//
// async onModuleDestroy() {
//   await this.$disconnect();
//   await this.pool.end();
// }
//
// 依赖已安装: pg@8.17.2, @prisma/adapter-pg@7.3.0
// ============================================================
