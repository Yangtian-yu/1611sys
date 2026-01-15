import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DutyService {
  constructor(private prisma: PrismaService) {}

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
      },
    };
  }

  private async generateWeeklySchedule(weekStartDate: Date) {
    // 获取所有员工，按 orderIndex 排序
    const allUsers = await this.prisma.user.findMany({
      where: {
        role: "EMPLOYEE",
      },
      orderBy: {
        orderIndex: "asc",
      },
    });

    if (allUsers.length === 0) {
      throw new Error("没有可用的员工");
    }

    // 获取上一周的排班记录
    const lastWeek = new Date(weekStartDate);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const lastSchedule = await this.prisma.dutySchedule.findFirst({
      where: {
        weekStartDate: lastWeek,
      },
    });

    let dutyUserIds: string[];

    if (!lastSchedule) {
      // 第一次排班，取前两个员工
      dutyUserIds = allUsers.slice(0, 2).map((u) => u.id);
    } else {
      // 找到上周最后一个值日人员的位置
      const lastDutyUserId =
        lastSchedule.dutyUserIds[lastSchedule.dutyUserIds.length - 1];
      const lastIndex = allUsers.findIndex((u) => u.id === lastDutyUserId);

      // 从下一个位置开始取2个人
      const nextIndex = (lastIndex + 1) % allUsers.length;
      const secondIndex = (lastIndex + 2) % allUsers.length;

      dutyUserIds = [allUsers[nextIndex].id, allUsers[secondIndex].id];
    }

    // 创建排班记录
    return this.prisma.dutySchedule.create({
      data: {
        weekStartDate,
        dutyUserIds,
        isManual: false,
      },
    });
  }
}
