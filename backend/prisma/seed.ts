import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // 创建初始管理员账号
  const hashedPassword = await bcrypt.hash("Admin@1611", 10);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      email: "admin@example.com",
      role: "ADMIN",
      orderIndex: 0,
    },
  });

  console.log("✅ 初始管理员账号创建成功:", admin.username);

  // 创建测试员工账号
  const employees = [
    { username: "李明", email: "liming@qq.com", orderIndex: 1 },
    { username: "王芳", email: "wangfang@qq.com", orderIndex: 2 },
    { username: "张三", email: "zhangsan@qq.com", orderIndex: 3 },
    { username: "李四", email: "lisi@qq.com", orderIndex: 4 },
  ];

  for (const emp of employees) {
    const password = await bcrypt.hash("123456", 10);
    await prisma.user.upsert({
      where: { username: emp.username },
      update: {},
      create: {
        username: emp.username,
        password,
        email: emp.email,
        role: "EMPLOYEE",
        orderIndex: emp.orderIndex,
      },
    });
  }

  console.log("✅ 测试员工账号创建成功");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
