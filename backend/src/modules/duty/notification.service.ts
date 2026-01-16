import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { HolidayService } from "./holiday.service";
import { DutyService } from "./duty.service";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly holidayService: HolidayService,
    private readonly dutyService: DutyService,
    private readonly mailService: MailService,
    private readonly prisma: PrismaService
  ) {}

  /**
   * 每天凌晨检查并记录本周的值日日
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkDutyDay() {
    const today = new Date();
    const lastWorkday = this.holidayService.getLastWorkdayOfWeek(today);
    this.logger.log(`本周预期值日发送日期: ${lastWorkday.toDateString()}`);
  }

  /**
   * 每天下午 17:00 运行
   * 逻辑：如果今天正好是“本周最后一个工作日”，则执行通知
   */
  @Cron("0 0 17 * * *")
  async handleDutyNotification() {
    const today = new Date();
    const lastWorkday = this.holidayService.getLastWorkdayOfWeek(today);

    // 比较日期（忽略时间）
    const isTodayDutyDay =
      today.getFullYear() === lastWorkday.getFullYear() &&
      today.getMonth() === lastWorkday.getMonth() &&
      today.getDate() === lastWorkday.getDate();

    if (isTodayDutyDay) {
      this.logger.log("检测到今天是本周最后一个工作日，准备触发值日通知...");
      await this.sendNotifications();
    } else {
      this.logger.debug("今天不是值日日，忽略。");
    }
  }

  private async sendNotifications() {
    try {
      // 获取当前周的排班信息
      const result = await this.dutyService.getCurrentWeekDuty();
      if (!result.success || !result.data.dutyUsers.length) {
        this.logger.warn("未找到本周值日人员，停止发送。");
        return;
      }

      const users = result.data.dutyUsers;
      const userNames = users.map((u) => u.username).join("、");

      // 获取所有员工的邮箱（用于全员通知）
      const allUsers = await this.prisma.user.findMany({
        where: { role: "EMPLOYEE" },
        select: { email: true },
      });
      const allEmails = allUsers.map((u) => u.email).filter((e) => !!e);

      if (allEmails.length === 0) {
        this.logger.warn("没有找到任何员工邮箱，取消发送。");
        return;
      }

      this.logger.log(
        `[通知系统] 正在向全员发送值日通知。本周值日：${userNames}`
      );

      const today = new Date();
      const lastWorkday = this.holidayService.getLastWorkdayOfWeek(today);

      const subject = `【1611值日系统】本周值日通知 - ${lastWorkday.toLocaleDateString()}`;
      const content = `
        各位同事：<br><br>
        
        本周的值班打扫安排已出炉。<br>
        值日人员：<b>${userNames}</b><br>
        预计打扫时间：<b>${lastWorkday.toLocaleDateString()} 下午 17:00 后</b><br><br>
        
        请准时完成值日工作，保持办公室整洁，谢谢配合！
      `;

      await this.mailService.sendMail(allEmails, subject, content);
    } catch (error) {
      this.logger.error("发送通知时出错:", error);
    }
  }
}
