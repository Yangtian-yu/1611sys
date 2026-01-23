# Prisma 7 升级指南

## 当前状态

- **Prisma 版本**: 5.20.0
- **驱动适配器依赖**: ✅ 已安装 (`pg@8.17.2`, `@prisma/adapter-pg@7.3.0`)
- **升级准备**: ✅ 依赖已就绪,仅需修改代码

---

## 升级步骤

### 1. 升级 Prisma 版本

```bash
cd backend
pnpm update @prisma/client prisma
```

### 2. 修改 `backend/src/prisma/prisma.service.ts`

将文件末尾注释掉的代码替换现有实现:

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;

  constructor() {
    // 创建 PostgreSQL 连接池
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // 创建 Prisma 适配器
    const adapter = new PrismaPg(pool);

    // 使用适配器初始化 PrismaClient (Prisma 7 必需)
    super({ adapter });

    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    // 关闭连接池
    await this.pool.end();
  }
}
```

### 3. 重新生成 Prisma Client

```bash
cd backend
npx prisma generate
```

### 4. 重新构建 Docker

```bash
docker-compose down
docker-compose up --build -d
```

---

## 为什么需要驱动适配器?

Prisma 7 移除了内置的 Rust 数据库引擎驱动,改为使用 JavaScript 驱动适配器:

- **优势**: 更灵活、支持更多边缘运行时(如 Cloudflare Workers)
- **变化**: 必须显式安装并配置数据库驱动(`pg`)和适配器(`@prisma/adapter-pg`)

---

## 回滚步骤

如果升级后遇到问题,可以回滚:

```bash
cd backend
pnpm add @prisma/client@5.20.0 prisma@5.20.0 --save-exact
```

然后恢复 `prisma.service.ts` 为当前的传统实现(文件中已保留)。

---

## 参考资料

- [Prisma 7 官方升级指南](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql)
- [PostgreSQL 驱动适配器文档](https://www.prisma.io/docs/orm/overview/databases/postgresql#driver-adapters)
