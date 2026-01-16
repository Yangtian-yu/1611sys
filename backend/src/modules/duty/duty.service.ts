import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";
import { HolidayService } from "./holiday.service";

@Injectable()
export class DutyService {
  constructor(
    private prisma: PrismaService,
    private holidayService: HolidayService
  ) {}

  async getCurrentWeekDuty() {
    // 获取本周一的日期
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 周日特殊处理
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    // 查找本周的排班记录
    let schedule = await this.prisma.dutySchedule.findFirst({
      where: {
        weekStartDate: monday,
      },
    });

    // 如果不存在，自动生成
    if (!schedule) {
      schedule = await this.generateWeeklySchedule(monday);
    } else {
      // 灵活性优化：无论是自动还是手动模式，都实时同步最新的人员状态与顺序
      // 获取当前所有活跃员工
      const allUsers = await this.prisma.user.findMany({
        where: { role: "EMPLOYEE" },
        orderBy: { orderIndex: "asc" },
      });

      if (allUsers.length > 0) {
        // 以前面存储的 ID 数量为准，重新计算最新的人选
        const currentDutyCount = schedule.dutyUserIds.length || 2;
        const { dutyUserIds: newDutyUserIds } = await this.calculateDutyUsers(
          monday,
          allUsers,
          currentDutyCount
        );

        // 检查是否有变动，如果有变动则更新数据库快照
        const isChanged =
          newDutyUserIds.length !== schedule.dutyUserIds.length ||
          newDutyUserIds.some((id, idx) => id !== schedule.dutyUserIds[idx]);

        if (isChanged) {
          schedule = await this.prisma.dutySchedule.update({
            where: { id: schedule.id },
            data: { dutyUserIds: newDutyUserIds },
          });
        }
      }
    }

    // 获取值日人员信息
    const dutyUsers = await this.prisma.user.findMany({
      where: {
        id: {
          in: schedule.dutyUserIds,
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    // 计算本周值日日（调休自适应）
    const dutyDate = this.holidayService.getLastWorkdayOfWeek(monday);

    return {
      success: true,
      data: {
        id: schedule.id,
        weekStartDate: schedule.weekStartDate.toISOString().split("T")[0],
        dutyDate: dutyDate.toISOString().split("T")[0],
        dutyUsers,
        isManual: schedule.isManual,
      },
    };
  }

  async updateCurrentWeekDuty(updateScheduleDto: UpdateScheduleDto) {
    const { dutyCount } = updateScheduleDto;

    // 获取本周一的日期
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    // 获取所有员工（按 orderIndex 排序）
    const allUsers = await this.prisma.user.findMany({
      where: { role: "EMPLOYEE" },
      orderBy: { orderIndex: "asc" },
    });

    if (allUsers.length < dutyCount) {
      throw new Error(
        `员工数量不足，当前只有${allUsers.length}人，无法安排${dutyCount}人值日`
      );
    }

    // 基于 ID 锚点计算值日人员（考虑免战状态）
    const { dutyUserIds } = await this.calculateDutyUsers(
      monday,
      allUsers,
      dutyCount
    );

    // 查找本周的排班记录
    let schedule = await this.prisma.dutySchedule.findFirst({
      where: {
        weekStartDate: monday,
      },
    });

    if (!schedule) {
      // 如果不存在，创建新排班
      schedule = await this.prisma.dutySchedule.create({
        data: {
          weekStartDate: monday,
          dutyUserIds,
          isManual: true,
        },
      });
    } else {
      // 更新现有排班
      schedule = await this.prisma.dutySchedule.update({
        where: { id: schedule.id },
        data: {
          dutyUserIds,
          isManual: true,
        },
      });
    }

    // 获取值日人员信息
    const dutyUsers = await this.prisma.user.findMany({
      where: {
        id: {
          in: schedule.dutyUserIds,
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return {
      success: true,
      data: {
        weekStartDate: schedule.weekStartDate.toISOString().split("T")[0],
        dutyUsers,
        isManual: schedule.isManual,
      },
      message: `已调整为${dutyCount}人值日`,
    };
  }

  // 核心计算逻辑：基于上周最后一个人 ID 寻踪，并跳过不活跃员工
  private async calculateDutyUsers(
    weekStartDate: Date,
    allUsers: any[],
    dutyCount: number = 2
  ) {
    // 1. 获取上周最后一个人 ID (锚点)
    const lastWeek = new Date(weekStartDate);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastSchedule = await this.prisma.dutySchedule.findFirst({
      where: { weekStartDate: lastWeek },
    });

    let lastIndex = -1;
    if (lastSchedule && lastSchedule.dutyUserIds.length > 0) {
      const lastDutyUserId =
        lastSchedule.dutyUserIds[lastSchedule.dutyUserIds.length - 1];
      lastIndex = allUsers.findIndex((u) => u.id === lastDutyUserId);
    }

    // 2. 从上一个人之后开始扫描，找出 isActive 为 true 的员工
    const dutyUserIds: string[] = [];

    if (allUsers.length === 0) {
      return { dutyUserIds: [] };
    }

    // 确定搜索起点
    let currentScanIndex = (lastIndex + 1) % allUsers.length;
    let foundCount = 0;
    const maxScan = allUsers.length; // 最多全盘扫描一次

    for (let i = 0; i < maxScan && foundCount < dutyCount; i++) {
      const user = allUsers[currentScanIndex] as any;
      if (user.isActive) {
        dutyUserIds.push(user.id);
        foundCount++;
      }
      currentScanIndex = (currentScanIndex + 1) % allUsers.length;
    }

    return { dutyUserIds };
  }

  private async generateWeeklySchedule(weekStartDate: Date) {
    const allUsers = await this.prisma.user.findMany({
      where: { role: "EMPLOYEE" },
      orderBy: { orderIndex: "asc" },
    });

    if (allUsers.length === 0) {
      throw new Error("没有可用的员工");
    }

    const { dutyUserIds } = await this.calculateDutyUsers(
      weekStartDate,
      allUsers
    );

    return this.prisma.dutySchedule.create({
      data: {
        weekStartDate,
        dutyUserIds,
        isManual: false,
      },
    });
  }
}
