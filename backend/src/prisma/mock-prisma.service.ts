import { Injectable, OnModuleInit } from '@nestjs/common';

// Mock 数据存储
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: '$2b$10$rdgFAGCCGOh4/mTc.GpMmenpu9tI/UXPr62UXvakoJhCsRavVRsHm', // Admin@1611
    name: '系统管理员',
    role: 'ADMIN',
    orderIndex: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    username: '李明',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 123456
    name: '李明',
    role: 'EMPLOYEE',
    orderIndex: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    username: '王芳',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 123456
    name: '王芳',
    role: 'EMPLOYEE',
    orderIndex: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    username: '张三',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 123456
    name: '张三',
    role: 'EMPLOYEE',
    orderIndex: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    username: '李四',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 123456
    name: '李四',
    role: 'EMPLOYEE',
    orderIndex: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockSchedules = [];

@Injectable()
export class MockPrismaService implements OnModuleInit {
  // Mock user operations
  user = {
    findUnique: async ({ where }: any) => {
      return mockUsers.find(
        (u) => u.id === where.id || u.username === where.username,
      );
    },
    findMany: async (args: any) => {
      let users = [...mockUsers];
      const { where, orderBy } = args;
      if (where && where.role) {
        users = users.filter((u) => u.role === where.role);
      }
      if (orderBy && orderBy.orderIndex) {
        users.sort((a, b) => a.orderIndex - b.orderIndex);
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
      return newUser;
    },
    update: async ({ where, data }: any) => {
      const index = mockUsers.findIndex((u) => u.id === where.id);
      if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...data, updatedAt: new Date() };
        return mockUsers[index];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      const index = mockUsers.findIndex((u) => u.id === where.id);
      if (index !== -1) {
        const deleted = mockUsers[index];
        mockUsers.splice(index, 1);
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
      if (orderBy && (orderBy as any).date === 'desc') {
        schedules.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
      return schedules[0] || null;
    },
    findMany: async ({ where = {}, orderBy = {}, include = {} }: any) => {
      let schedules = [...mockSchedules];
      if (where && (where as any).date) {
        const dateFilter = (where as any).date;
        if (dateFilter.gte) {
          schedules = schedules.filter((s) => new Date(s.date) >= new Date(dateFilter.gte));
        }
        if (dateFilter.lte) {
          schedules = schedules.filter((s) => new Date(s.date) <= new Date(dateFilter.lte));
        }
      }
      if (orderBy && (orderBy as any).date === 'desc') {
        schedules.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      } else if (orderBy && (orderBy as any).date === 'asc') {
        schedules.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      }
      
      // Include user data if requested
      if (include && (include as any).user) {
        schedules = schedules.map(s => ({
          ...s,
          user: mockUsers.find(u => u.id === s.userId)
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
      return newSchedule;
    },
    update: async ({ where, data }: any) => {
      const index = mockSchedules.findIndex((s) => s.id === where.id);
      if (index !== -1) {
        mockSchedules[index] = { ...mockSchedules[index], ...data, updatedAt: new Date() };
        return mockSchedules[index];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      const index = mockSchedules.findIndex((s) => s.id === where.id);
      if (index !== -1) {
        const deleted = mockSchedules[index];
        mockSchedules.splice(index, 1);
        return deleted;
      }
      return null;
    },
  };

  async onModuleInit() {
    console.log('🎭 Mock Prisma Service initialized');
    console.log(`📊 Mock Users: ${mockUsers.length}`);
    console.log(`📅 Mock Schedules: ${mockSchedules.length}`);
  }

  // Mock connection methods
  async $connect() {
    console.log('🔌 Mock database connected');
  }

  async $disconnect() {
    console.log('🔌 Mock database disconnected');
  }
}
