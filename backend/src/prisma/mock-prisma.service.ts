import { Injectable, OnModuleInit } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

// JSON 文件路径 - 指向项目根目录的 data 文件夹
const DATA_FILE_PATH = path.join(process.cwd(), "data", "mock-data.json");

// Mock 数据存储（从文件加载）
let mockUsers = [];
let mockSchedules = [];

@Injectable()
export class MockPrismaService implements OnModuleInit {
  // 从 JSON 文件加载数据
  private loadData() {
    try {
      if (fs.existsSync(DATA_FILE_PATH)) {
        const rawData = fs.readFileSync(DATA_FILE_PATH, "utf-8");
        const data = JSON.parse(rawData);

        // 转换日期字符串为 Date 对象
        mockUsers = data.users.map((u: any) => ({
          ...u,
          createdAt: new Date(u.createdAt),
          updatedAt: new Date(u.updatedAt),
        }));

        mockSchedules = data.schedules.map((s: any) => ({
          ...s,
          weekStartDate: new Date(s.weekStartDate),
          createdAt: new Date(s.createdAt),
        }));

        console.log("📂 Mock data loaded from file");
        console.log(
          `   Users: ${mockUsers.length}, Schedules: ${mockSchedules.length}`
        );
      } else {
        console.log("⚠️  Mock data file not found, will create on first save");
      }
    } catch (error) {
      console.error("❌ Failed to load mock data:", error.message);
      // 如果加载失败，使用空数组
      mockUsers = [];
      mockSchedules = [];
    }
  }

  // 保存数据到 JSON 文件
  private saveData() {
    try {
      const data = {
        users: mockUsers,
        schedules: mockSchedules,
      };
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
      console.log("💾 Mock data saved to file");
    } catch (error) {
      console.error("❌ Failed to save mock data:", error.message);
    }
  }

  // Mock user operations
  user = {
    findUnique: async ({ where }: any) => {
      return mockUsers.find(
        (u) =>
          String(u.id) === String(where.id) || u.username === where.username
      );
    },
    findMany: async (args: any) => {
      let users = [...mockUsers];
      const { where, orderBy } = args;
      if (where) {
        if (where.role) {
          users = users.filter((u) => u.role === where.role);
        }
        if (where.isActive !== undefined) {
          users = users.filter((u) => u.isActive === where.isActive);
        }
        if (where.id && where.id.in) {
          const ids = where.id.in.map((id) => String(id));
          users = users.filter((u) => ids.includes(String(u.id)));
        }
      }
      if (orderBy && orderBy.orderIndex) {
        users.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      }
      return users;
    },
    create: async ({ data }: any) => {
      const newUser = {
        id: mockUsers.length + 1,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsers.push(newUser);
      this.saveData(); // 保存到文件
      return newUser;
    },
    update: async ({ where, data }: any) => {
      const index = mockUsers.findIndex(
        (u) => String(u.id) === String(where.id)
      );
      if (index !== -1) {
        mockUsers[index] = {
          ...mockUsers[index],
          ...data,
          updatedAt: new Date(),
        };
        this.saveData(); // 保存到文件
        return mockUsers[index];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      const index = mockUsers.findIndex(
        (u) => String(u.id) === String(where.id)
      );
      if (index !== -1) {
        const deleted = mockUsers[index];
        mockUsers.splice(index, 1);
        this.saveData(); // 保存到文件
        return deleted;
      }
      return null;
    },
  };

  // Mock dutySchedule operations
  dutySchedule = {
    findFirst: async ({ where = {}, orderBy = {} }: any) => {
      let schedules = [...mockSchedules];
      if (where && (where as any).date) {
        schedules = schedules.filter((s) => {
          const scheduleDate = new Date(s.date);
          const targetDate = new Date((where as any).date);
          return scheduleDate.toDateString() === targetDate.toDateString();
        });
      }
      if (where && (where as any).weekStartDate) {
        schedules = schedules.filter((s) => {
          const scheduleDate = new Date(s.weekStartDate);
          const targetDate = new Date((where as any).weekStartDate);
          return scheduleDate.toDateString() === targetDate.toDateString();
        });
      }
      if (orderBy && (orderBy as any).date === "desc") {
        schedules.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      }
      return schedules[0] || null;
    },
    findMany: async ({ where = {}, orderBy = {}, include = {} }: any) => {
      let schedules = [...mockSchedules];
      if (where && (where as any).date) {
        const dateFilter = (where as any).date;
        if (dateFilter.gte) {
          schedules = schedules.filter(
            (s) => new Date(s.date) >= new Date(dateFilter.gte)
          );
        }
        if (dateFilter.lte) {
          schedules = schedules.filter(
            (s) => new Date(s.date) <= new Date(dateFilter.lte)
          );
        }
      }
      if (orderBy && (orderBy as any).date === "desc") {
        schedules.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      } else if (orderBy && (orderBy as any).date === "asc") {
        schedules.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      }

      // Include user data if requested
      if (include && (include as any).user) {
        schedules = schedules.map((s) => ({
          ...s,
          user: mockUsers.find((u) => u.id === s.userId),
        }));
      }

      return schedules;
    },
    create: async ({ data }: any) => {
      const newSchedule = {
        id: mockSchedules.length + 1,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockSchedules.push(newSchedule);
      this.saveData(); // 保存到文件
      return newSchedule;
    },
    update: async ({ where, data }: any) => {
      const index = mockSchedules.findIndex((s) => s.id === where.id);
      if (index !== -1) {
        mockSchedules[index] = {
          ...mockSchedules[index],
          ...data,
          updatedAt: new Date(),
        };
        this.saveData(); // 保存到文件
        return mockSchedules[index];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      const index = mockSchedules.findIndex((s) => s.id === where.id);
      if (index !== -1) {
        const deleted = mockSchedules[index];
        mockSchedules.splice(index, 1);
        this.saveData(); // 保存到文件
        return deleted;
      }
      return null;
    },
  };

  async onModuleInit() {
    // 启动时从文件加载数据
    this.loadData();
    console.log("🎭 Mock Prisma Service initialized");
    console.log(`📊 Mock Users: ${mockUsers.length}`);
    console.log(`📅 Mock Schedules: ${mockSchedules.length}`);
  }

  // Mock connection methods
  async $connect() {
    console.log("🔌 Mock database connected");
  }

  async $disconnect() {
    console.log("🔌 Mock database disconnected");
  }
}
